import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { EmployeeDomainService } from '@src/domain/organization/employee/services/employee-domain.service';

/**
 * 부서 컨텍스트 서비스
 * - 부서와 다른 도메인 간의 상호작용을 처리
 * - 권한 관리 및 직원 배치 등 복합 비즈니스 로직 처리
 */
@Injectable()
export class DepartmentContextService {
    private readonly logger = new Logger(DepartmentContextService.name);

    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly userDomainService: UserDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
    ) {}

    /**
     * 부서 접근 권한 추가
     */
    async addAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 이미 권한이 있는지 확인
        if (!department.isAccessAuthority(user)) {
            department.includeAccessAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 접근 권한 추가: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 검토 권한 추가
     */
    async addReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 이미 권한이 있는지 확인
        if (!department.isReviewAuthority(user)) {
            department.includeReviewAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 검토 권한 추가: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 접근 권한 제거
     */
    async removeAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 권한이 있는지 확인하고 제거
        if (department.isAccessAuthority(user)) {
            department.excludeAccessAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 접근 권한 제거: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 검토 권한 제거
     */
    async removeReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 권한이 있는지 확인하고 제거
        if (department.isReviewAuthority(user)) {
            department.excludeReviewAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 검토 권한 제거: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 사번으로 직원 조회
     */
    async findEmployeeByNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeDomainService.findEmployeeByEmployeeNumber(employeeNumber);
    }

    /**
     * 직원 정보 저장
     */
    async saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        return await this.employeeRepository.save(employee);
    }

    /**
     * 부서-직원 관계 저장
     */
    async saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity> {
        return await this.departmentEmployeeRepository.save(departmentEmployee);
    }

    /**
     * 직원 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByEmployeeId(employeeId: string): Promise<void> {
        const departmentEmployees = await this.departmentEmployeeRepository.find({
            where: { employee: { employeeId } },
            relations: ['employee'],
        });

        if (departmentEmployees.length > 0) {
            await this.departmentEmployeeRepository.remove(departmentEmployees);
            this.logger.log(`부서-직원 관계 삭제: ${employeeId}`);
        }
    }

    /**
     * 사용자 ID로 접근 권한이 있는 부서 조회
     */
    async findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: { accessAuthorities: { userId } },
            relations: ['accessAuthorities'],
        });
    }

    /**
     * 사용자 ID로 검토 권한이 있는 부서 조회
     */
    async findDepartmentsByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: { reviewAuthorities: { userId } },
            relations: ['reviewAuthorities'],
        });
    }

    /**
     * 부서 검색 (사용자 권한 포함)
     */
    async searchDepartments(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
        if (userId) {
            // 사용자 권한이 있는 부서만 검색
            const [accessDepartments, reviewDepartments] = await Promise.all([
                this.departmentRepository.find({
                    where: [
                        { departmentName: Like(`%${searchTerm}%`), accessAuthorities: { userId } },
                        { departmentCode: Like(`%${searchTerm}%`), accessAuthorities: { userId } },
                    ],
                    relations: ['accessAuthorities'],
                }),
                this.departmentRepository.find({
                    where: [
                        { departmentName: Like(`%${searchTerm}%`), reviewAuthorities: { userId } },
                        { departmentCode: Like(`%${searchTerm}%`), reviewAuthorities: { userId } },
                    ],
                    relations: ['reviewAuthorities'],
                }),
            ]);

            // 중복 제거
            const allDepartments = [...accessDepartments, ...reviewDepartments];
            const uniqueDepartments = allDepartments.filter(
                (dept, index, self) => self.findIndex((d) => d.departmentId === dept.departmentId) === index,
            );
            return uniqueDepartments;
        } else {
            // 모든 부서에서 검색
            return await this.departmentRepository.find({
                where: [{ departmentName: Like(`%${searchTerm}%`) }, { departmentCode: Like(`%${searchTerm}%`) }],
                order: { departmentName: 'ASC' },
            });
        }
    }
}
