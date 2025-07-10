import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { OrganizationChartInfoEntity } from '@src/domain/organization/entities/organization-chart-info.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';

export interface OrganizationNodeData {
    id?: string;
    name: string;
    isSupport: boolean;
    parentId?: string;
    position?: {
        x: number;
        y: number;
    };
    employees?: {
        employeeId: string;
        employeeName?: string;
    }[];
    children?: OrganizationNodeData[];
}

export interface OrganizationTreeNode {
    id: string;
    name: string;
    isSupport: boolean;
    parentId?: string;
    position: {
        x: number;
        y: number;
    };
    employees: {
        employeeId: string;
        employeeName: string;
    }[];
    children: OrganizationTreeNode[];
}

// 조직도 도메인 서비스 클래스
@Injectable()
export class OrganizationDomainService {
    private readonly logger = new Logger(OrganizationDomainService.name);

    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
        @InjectRepository(OrganizationChartInfoEntity)
        private readonly organizationChartRepository: Repository<OrganizationChartInfoEntity>,
        @InjectRepository(LamsUserEntity)
        private readonly lamsUserRepository: Repository<LamsUserEntity>,
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
        private readonly dataSource: DataSource,
    ) {}

    /**
     * 조직도 전체 트리 조회
     */
    async getOrganizationTree(): Promise<OrganizationTreeNode[]> {
        try {
            const rootDepartments = await this.departmentRepository.find({
                where: { parentDepartmentId: null },
                relations: ['employees', 'employees.employee', 'orgChartInfo'],
                order: { orgChartInfo: { isSupport: 'DESC' } },
            });

            const result: OrganizationTreeNode[] = [];
            for (const dept of rootDepartments) {
                const treeNode = await this.buildOrganizationTreeNode(dept);
                result.push(treeNode);
            }

            return result;
        } catch (error) {
            this.logger.error('조직도 트리 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 조직도 저장
     */
    async saveOrganizationTree(organizationTree: OrganizationNodeData): Promise<void> {
        try {
            await this.dataSource.transaction(async (manager: EntityManager) => {
                // 1. 모든 직원의 부서 연결 해제
                await manager.update(EmployeeInfoEntity, {}, { department: null });

                // 2. 기존 부서 ID 수집
                const existingDepartments = await manager.find(DepartmentInfoEntity);
                const existingDeptIds = new Set(existingDepartments.map((d) => d.departmentId));

                // 3. 새로운 조직도의 부서 ID 수집
                const newDeptIds = new Set<string>();
                this.collectDepartmentIds(organizationTree, newDeptIds);

                // 4. 삭제된 부서 처리
                const deletedDeptIds = [...existingDeptIds].filter((id) => !newDeptIds.has(id));
                if (deletedDeptIds.length > 0) {
                    await this.deleteRemovedDepartments(manager, deletedDeptIds, existingDepartments);
                }

                // 5. 조직도 저장
                await this.saveOrganizationNode(organizationTree, undefined, manager, existingDeptIds);

                // 6. 권한 설정
                await this.setupDepartmentAuthorities(manager);
            });

            this.logger.log('조직도 저장 완료');
        } catch (error) {
            this.logger.error('조직도 저장 실패', error.stack);
            throw new InternalServerErrorException('조직도 저장 중 오류가 발생했습니다.');
        }
    }

    /**
     * 조직도 노드 생성
     */
    private async buildOrganizationTreeNode(department: DepartmentInfoEntity): Promise<OrganizationTreeNode> {
        const children = await this.departmentRepository.find({
            where: { parentDepartmentId: department.departmentId },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
            order: { orgChartInfo: { isSupport: 'ASC' } },
        });

        const childNodes: OrganizationTreeNode[] = [];
        for (const child of children) {
            const childNode = await this.buildOrganizationTreeNode(child);
            childNodes.push(childNode);
        }

        return {
            id: department.departmentId,
            name: department.departmentName,
            isSupport: department.orgChartInfo?.isSupport || false,
            parentId: department.parentDepartmentId,
            position: {
                x: department.orgChartInfo?.positionX || 0,
                y: department.orgChartInfo?.positionY || 0,
            },
            employees:
                department.employees?.map((deptEmp) => ({
                    employeeId: deptEmp.employee.employeeId,
                    employeeName: deptEmp.employee.employeeName,
                })) || [],
            children: childNodes,
        };
    }

    /**
     * 부서 ID 수집
     */
    private collectDepartmentIds(node: OrganizationNodeData, deptIds: Set<string>): void {
        if (node.id) {
            deptIds.add(node.id);
        }
        node.children?.forEach((child) => this.collectDepartmentIds(child, deptIds));
    }

    /**
     * 삭제된 부서 처리
     */
    private async deleteRemovedDepartments(
        manager: EntityManager,
        deletedDeptIds: string[],
        existingDepartments: DepartmentInfoEntity[],
    ): Promise<void> {
        // 스냅샷 데이터의 부서 참조 제거
        await manager
            .createQueryBuilder()
            .update('data_snapshot_info_entity')
            .set({ department: null })
            .where('department IN (:...ids)', { ids: deletedDeptIds })
            .execute();

        // 부서 직원 관계 삭제
        await manager.delete(DepartmentEmployeeEntity, {
            department: { departmentId: In(deletedDeptIds) },
        });

        // 접근 권한 관계 삭제
        await manager
            .createQueryBuilder()
            .delete()
            .from('accessAuthorities')
            .where('departmentInfoEntityDepartmentId IN (:...ids)', { ids: deletedDeptIds })
            .execute();

        // 검토 권한 관계 삭제
        await manager
            .createQueryBuilder()
            .delete()
            .from('reviewAuthorities')
            .where('departmentInfoEntityDepartmentId IN (:...ids)', { ids: deletedDeptIds })
            .execute();

        // 부서 삭제
        await manager.delete(DepartmentInfoEntity, deletedDeptIds);

        // 차트 정보 삭제
        const chartInfoIds = existingDepartments
            .filter((d) => deletedDeptIds.includes(d.departmentId))
            .map((d) => d.orgChartInfoId)
            .filter((id) => id);

        if (chartInfoIds.length > 0) {
            await manager.delete(OrganizationChartInfoEntity, chartInfoIds);
        }
    }

    /**
     * 조직도 노드 저장
     */
    private async saveOrganizationNode(
        node: OrganizationNodeData,
        parent?: DepartmentInfoEntity,
        manager?: EntityManager,
        existingDeptIds?: Set<string>,
    ): Promise<DepartmentInfoEntity> {
        const entityManager = manager || this.dataSource.manager;

        let department: DepartmentInfoEntity;

        if (node.id && existingDeptIds?.has(node.id)) {
            // 기존 부서 업데이트
            department = await entityManager.findOne(DepartmentInfoEntity, {
                where: { departmentId: node.id },
            });

            if (!department) {
                throw new BadRequestException(`부서를 찾을 수 없습니다: ${node.id}`);
            }

            department.departmentName = node.name;
            department.parentDepartmentId = parent?.departmentId;

            // 차트 정보 업데이트
            let chartInfo = await entityManager.findOne(OrganizationChartInfoEntity, {
                where: { orgChartInfoId: department.orgChartInfoId },
            });

            if (!chartInfo) {
                chartInfo = entityManager.create(OrganizationChartInfoEntity, {
                    isSupport: node.isSupport,
                    positionX: node.position?.x || 0,
                    positionY: node.position?.y || 0,
                });
            } else {
                chartInfo.isSupport = node.isSupport;
                chartInfo.positionX = node.position?.x || 0;
                chartInfo.positionY = node.position?.y || 0;
            }

            await entityManager.save(chartInfo);
            department.orgChartInfoId = chartInfo.orgChartInfoId;
        } else {
            // 새로운 부서 생성
            const chartInfo = entityManager.create(OrganizationChartInfoEntity, {
                isSupport: node.isSupport,
                positionX: node.position?.x || 0,
                positionY: node.position?.y || 0,
            });
            await entityManager.save(chartInfo);

            department = entityManager.create(DepartmentInfoEntity, {
                departmentId: node.id,
                departmentName: node.name,
                parentDepartmentId: parent?.departmentId,
                orgChartInfoId: chartInfo.orgChartInfoId,
                isExclude: false,
            });
        }

        await entityManager.save(department);

        // 직원 연결 업데이트
        await entityManager.delete(DepartmentEmployeeEntity, {
            department: { departmentId: department.departmentId },
        });

        if (node.employees) {
            for (const emp of node.employees) {
                const departmentEmployee = entityManager.create(DepartmentEmployeeEntity, {
                    department,
                    employee: { employeeId: emp.employeeId },
                });
                await entityManager.save(departmentEmployee);
            }
        }

        // 하위 부서 저장
        if (node.children) {
            for (const child of node.children) {
                await this.saveOrganizationNode(child, department, entityManager, existingDeptIds);
            }
        }

        return department;
    }

    /**
     * 부서 권한 설정
     */
    private async setupDepartmentAuthorities(manager: EntityManager): Promise<void> {
        const lamsUsers = await manager.find(LamsUserEntity, {
            where: [{ hasAccessAuthority: true }, { hasReviewAuthority: true }],
        });

        for (const user of lamsUsers) {
            // 사용자와 매칭되는 직원 찾기
            const employee = await manager.findOne(EmployeeInfoEntity, {
                where: [{ email: user.email }, { employeeName: user.username }],
            });

            if (!employee) continue;

            // 직원이 속한 부서들 찾기
            const departmentEmployees = await manager.find(DepartmentEmployeeEntity, {
                where: { employee: { employeeId: employee.employeeId } },
                relations: ['department'],
            });

            for (const deptEmp of departmentEmployees) {
                // 각 부서와 하위 부서들에 대한 권한 설정
                await this.setupDepartmentHierarchyAuthorities(manager, deptEmp.department, user);
            }
        }
    }

    /**
     * 부서 계층 권한 설정
     */
    private async setupDepartmentHierarchyAuthorities(
        manager: EntityManager,
        department: DepartmentInfoEntity,
        user: LamsUserEntity,
    ): Promise<void> {
        // 현재 부서에 대한 권한 설정
        if (user.hasAccessAuthority) {
            department.includeAccessAuthority(user);
        }
        if (user.hasReviewAuthority) {
            department.includeReviewAuthority(user);
        }
        await manager.save(department);

        // 하위 부서 조회
        const childDepartments = await manager.find(DepartmentInfoEntity, {
            where: { parentDepartmentId: department.departmentId },
        });

        // 재귀적으로 하위 부서에도 권한 설정
        for (const childDept of childDepartments) {
            await this.setupDepartmentHierarchyAuthorities(manager, childDept, user);
        }
    }
}
