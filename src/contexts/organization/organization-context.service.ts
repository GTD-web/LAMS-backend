import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../../domain/organization/department/entities/department-employee.entity';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
import { LamsUserEntity } from '../../domain/user/entities/lams-user.entity';
import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import { UserDomainService } from '../../domain/user/services/user-domain.service';
import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
import { MMSDepartmentResponseDto } from '../../interfaces/dto/organization/requests/mms-department-import.dto';
import { MMSEmployeeResponseDto } from '../../interfaces/dto/organization/requests/mms-employee-import.dto';

/**
 * 조직 컨텍스트 서비스
 * - User, Department, Employee 통합 관리
 * - 조직 관련 모든 상호작용 처리
 * - MMS 외부 시스템과의 동기화 처리
 */
@Injectable()
export class OrganizationContextService {
    private readonly logger = new Logger(OrganizationContextService.name);
    private readonly MMS_BASE_URL = 'https://lumir-metadata-manager.vercel.app';

    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly userDomainService: UserDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
    ) {}

    // ==================== USER 관련 메서드 ====================

    /**
     * 사용자 조회 (ID)
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.userDomainService.findUserById(userId);
    }

    /**
     * 사용자 조회 (이메일)
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userDomainService.findUserByEmail(email);
    }

    // ==================== DEPARTMENT 관련 메서드 ====================

    /**
     * 부서 조회 (ID)
     */
    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }

    /**
     * 부서 계층 구조 조회
     */
    async findDepartmentHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentDomainService.findHierarchy(departmentId);
    }

    /**
     * 부서 제외 상태 토글
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        return await this.departmentDomainService.toggleDepartmentExclude(departmentId);
    }

    /**
     * 부서 검색
     */
    async searchDepartments(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
        if (userId) {
            // 사용자 권한이 있는 부서만 검색
            const [accessDepartments, reviewDepartments] = await Promise.all([
                this.departmentRepository.find({
                    where: [
                        { departmentName: searchTerm, accessAuthorities: { userId } },
                        { departmentCode: searchTerm, accessAuthorities: { userId } },
                    ],
                    relations: ['accessAuthorities'],
                }),
                this.departmentRepository.find({
                    where: [
                        { departmentName: searchTerm, reviewAuthorities: { userId } },
                        { departmentCode: searchTerm, reviewAuthorities: { userId } },
                    ],
                    relations: ['reviewAuthorities'],
                }),
            ]);

            // 중복 제거
            const allDepartments = [...accessDepartments, ...reviewDepartments];
            return allDepartments.filter(
                (dept, index, self) => self.findIndex((d) => d.departmentId === dept.departmentId) === index,
            );
        } else {
            return await this.departmentDomainService.searchDepartments(searchTerm);
        }
    }

    // ==================== EMPLOYEE 관련 메서드 ====================

    /**
     * 직원 조회 (ID)
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeDomainService.findEmployeeById(employeeId);
    }

    /**
     * 직원 조회 (사번)
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeDomainService.findEmployeeByEmployeeNumber(employeeNumber);
    }

    /**
     * 부서별 직원 조회
     */
    async findEmployeesByDepartment(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeDomainService.findEmployeesByDepartmentWithQuitFilter(departmentId);
    }

    /**
     * 직원 제외 상태 토글
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        return await this.employeeDomainService.toggleEmployeeExclude(employeeId);
    }

    // ==================== 권한 관리 메서드 ====================

    /**
     * 부서 접근 권한 추가
     */
    async addDepartmentAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        if (!department.isAccessAuthority(user)) {
            department.includeAccessAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 접근 권한 추가: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 접근 권한 제거
     */
    async removeDepartmentAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        if (department.isAccessAuthority(user)) {
            department.excludeAccessAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 접근 권한 제거: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 검토 권한 추가
     */
    async addDepartmentReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        if (!department.isReviewAuthority(user)) {
            department.includeReviewAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 검토 권한 추가: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    /**
     * 부서 검토 권한 제거
     */
    async removeDepartmentReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        if (department.isReviewAuthority(user)) {
            department.excludeReviewAuthority(user);
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 검토 권한 제거: ${department.departmentName} -> ${userId}`);
            return updatedDepartment;
        }

        return department;
    }

    // ==================== 부서-직원 관계 관리 ====================

    /**
     * 직원을 부서에 배치
     */
    async assignEmployeeToDepartment(employeeId: string, departmentId: string): Promise<DepartmentEmployeeEntity> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const departmentEmployee = new DepartmentEmployeeEntity();
        departmentEmployee.employee = employee;
        departmentEmployee.department = department;

        return await this.departmentEmployeeRepository.save(departmentEmployee);
    }

    /**
     * 직원을 부서에서 제거
     */
    async removeEmployeeFromDepartment(employeeId: string, departmentId: string): Promise<void> {
        const departmentEmployee = await this.departmentEmployeeRepository.findOne({
            where: { employee: { employeeId }, department: { departmentId } },
        });

        if (departmentEmployee) {
            await this.departmentEmployeeRepository.remove(departmentEmployee);
        }
    }

    // ==================== MMS 동기화 메서드 ====================

    /**
     * MMS에서 직원 정보를 가져옵니다.
     */
    async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
        try {
            const response = await axios.get(`${this.MMS_BASE_URL}/api/employees?detailed=true`);
            this.logger.log(`MMS에서 ${response.data.length}명의 직원 정보를 가져왔습니다.`);
            return response.data;
        } catch (error) {
            this.logger.error('MMS 직원 정보 조회 실패', error);
            throw new Error('MMS 직원 정보를 가져오는데 실패했습니다.');
        }
    }

    /**
     * MMS에서 부서 정보를 가져옵니다.
     */
    async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
        try {
            const response = await axios.get(`${this.MMS_BASE_URL}/api/departments?hierarchy=true`);
            this.logger.log(`MMS에서 ${response.data.length}개의 부서 정보를 가져왔습니다.`);
            return response.data;
        } catch (error) {
            this.logger.error('MMS 부서 정보 조회 실패', error);
            throw new Error('MMS 부서 정보를 가져오는데 실패했습니다.');
        }
    }

    /**
     * MMS와 로컬 시스템 간의 전체 동기화를 수행합니다.
     */
    async synchronizeWithMMS(): Promise<void> {
        try {
            this.logger.log('MMS 동기화 시작');

            // TODO: MMS 동기화 로직 구현
            this.logger.log('MMS 동기화 완료');
        } catch (error) {
            this.logger.error('MMS 동기화 실패', error);
            throw error;
        }
    }

    /**
     * 부서 정보를 동기화합니다.
     */
    private async synchronizeDepartments(departments: MMSDepartmentResponseDto[]): Promise<string[]> {
        const syncedDepartmentIds: string[] = [];
        // TODO: 부서 동기화 로직 구현
        this.logger.log(`${syncedDepartmentIds.length}개 부서 동기화 완료`);
        return syncedDepartmentIds;
    }

    /**
     * 부서 계층 구조를 재귀적으로 처리합니다.
     */
    private async processDepartmentHierarchy(
        department: MMSDepartmentResponseDto,
        parentDepartment?: DepartmentInfoEntity,
    ): Promise<DepartmentInfoEntity> {
        // TODO: 부서 계층 처리 로직 구현
        return new DepartmentInfoEntity();
    }

    /**
     * MMS 부서 정보로 부서를 생성하거나 업데이트합니다.
     */
    private async createOrUpdateMmsDepartment(department: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity> {
        // TODO: MMS 부서 생성/업데이트 로직 구현
        return new DepartmentInfoEntity();
    }

    /**
     * 동기화된 부서 ID를 재귀적으로 수집합니다.
     */
    private collectSyncedDepartmentIds(department: MMSDepartmentResponseDto, syncedIds: string[]): void {
        // TODO: 부서 ID 수집 로직 구현
    }

    /**
     * MMS에서 삭제된 부서를 로컬에서도 삭제합니다.
     */
    private async removeDeletedDepartments(syncedDepartmentIds: string[]): Promise<void> {
        // TODO: 삭제된 부서 처리 로직 구현
    }

    /**
     * 직원 정보를 동기화합니다.
     */
    private async synchronizeEmployees(employees: MMSEmployeeResponseDto[]): Promise<void> {
        // TODO: 직원 동기화 로직 구현
        this.logger.log(`직원 동기화 완료: ${employees.length}명`);
    }

    /**
     * MMS 직원 정보로 직원을 생성하거나 업데이트합니다.
     */
    private async createOrUpdateMmsEmployee(employee: MMSEmployeeResponseDto): Promise<EmployeeInfoEntity> {
        // TODO: MMS 직원 생성/업데이트 로직 구현
        return new EmployeeInfoEntity();
    }
}
