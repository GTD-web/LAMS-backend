import { Injectable, Logger } from '@nestjs/common';
import { MMSDepartmentResponseDto } from './dto/responses/mms-department-import.dto';
import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import axios from 'axios';
import { MMSEmployeeResponseDto } from '../employee/dto/responses/mms-employee-import.dto';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../../domain/organization/department/entities/department-employee.entity';

@Injectable()
export class DepartmentImportService {
    private readonly logger = new Logger(DepartmentImportService.name);

    constructor(private readonly departmentService: DepartmentDomainService) {}

    async getEmployees(): Promise<MMSEmployeeResponseDto[]> {
        const url = 'https://lumir-metadata-manager.vercel.app';
        const employees = await axios.get(`${url}/api/employees?detailed=true`);
        return employees.data;
    }

    async getMMSDepartments(): Promise<MMSDepartmentResponseDto[]> {
        const url = 'https://lumir-metadata-manager.vercel.app';
        const department = await axios.get(`${url}/api/departments?hierarchy=true`);
        return department.data;
    }

    async syncMMS(): Promise<void> {
        const employees = await this.getEmployees();
        const departments = await this.getMMSDepartments();
        const syncedMmsDepartmentIds: string[] = [];

        // 최상위 부서부터 재귀적으로 처리하며 동기화된 부서 ID를 수집
        for (const department of departments) {
            await this.processDepartmentHierarchy(department);
            this.collectSyncedDepartmentIds(department, syncedMmsDepartmentIds);
        }

        // 기존 부서목록에서 삭제된 부서 삭제
        await this.removeDeletedDepartments(syncedMmsDepartmentIds);

        for (const employee of employees) {
            let employeeInfo = await this.departmentService.findEmployeeByEmployeeNumber(employee.employee_number);
            if (employeeInfo) {
                employeeInfo.email = employee.email;
                employeeInfo.entryAt = employee.hire_date.split('T')[0];
                employeeInfo.birthDate = employee.date_of_birth.split('T')[0];
                employeeInfo.quitedAt = employee.termination_date ? employee.termination_date.split('T')[0] : null;
                employeeInfo = await this.departmentService.saveEmployee(employeeInfo);
            } else {
                const newEmployee = new EmployeeInfoEntity();
                newEmployee.employeeName = employee.name;
                newEmployee.employeeNumber = employee.employee_number;
                newEmployee.email = employee.email;
                newEmployee.entryAt = employee.hire_date ? employee.hire_date.split('T')[0] : null;
                newEmployee.birthDate = employee.date_of_birth ? employee.date_of_birth.split('T')[0] : null;
                newEmployee.quitedAt = employee.termination_date ? employee.termination_date.split('T')[0] : null;
                employeeInfo = await this.departmentService.saveEmployee(newEmployee);
            }

            await this.departmentService.deleteDepartmentEmployeeByEmployeeId(employeeInfo.employeeId);

            if (employee.department && employee.status === '재직중') {
                const departmentInfo = await this.departmentService.findDepartmentByMMSDepartmentId(
                    employee.department._id,
                );
                const departmentEmployee = new DepartmentEmployeeEntity();
                departmentEmployee.department = departmentInfo;
                departmentEmployee.employee = employeeInfo;
                await this.departmentService.saveDepartmentEmployee(departmentEmployee);
            }
        }
    }

    // MMS에서 동기화된 부서 ID를 수집하는 재귀 함수
    private collectSyncedDepartmentIds(department: MMSDepartmentResponseDto, syncedIds: string[]): void {
        syncedIds.push(department.id);

        if (department.child_departments && department.child_departments.length > 0) {
            for (const childDepartment of department.child_departments) {
                this.collectSyncedDepartmentIds(childDepartment, syncedIds);
            }
        }
    }

    // 기존 부서목록에서 삭제된 부서를 처리하는 함수
    private async removeDeletedDepartments(syncedMmsDepartmentIds: string[]): Promise<void> {
        try {
            // 모든 부서 정보 가져오기
            const allDepartments = await this.departmentService.findAllDepartments();
            console.log('allDepartments', allDepartments);
            // MMS에서 더 이상 존재하지 않는 부서 찾기
            const deletedDepartments = allDepartments.filter(
                (department) =>
                    !department.mmsDepartmentId ||
                    (department.mmsDepartmentId && !syncedMmsDepartmentIds.includes(department.mmsDepartmentId)),
            );

            // 삭제될 부서 로깅
            if (deletedDepartments.length > 0) {
                this.logger.log(`삭제 대상 부서 발견: ${deletedDepartments.map((d) => d.departmentName).join(', ')}`);
            }

            // 삭제 처리
            for (const department of deletedDepartments) {
                this.logger.log(`부서 삭제 처리 중: ${department.departmentName} (ID: ${department.departmentId})`);
                await this.departmentService.removeDepartment(department.departmentId);
                this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
            }
        } catch (error) {
            this.logger.error('부서 삭제 처리 중 오류 발생', error);
            throw error;
        }
    }

    // 부서와 하위 부서를 재귀적으로 처리하는 함수
    private async processDepartmentHierarchy(
        department: MMSDepartmentResponseDto,
        parentDepartment?: DepartmentInfoEntity,
    ): Promise<DepartmentInfoEntity> {
        // 현재 부서 생성 또는 업데이트
        const departmentInfo = await this.createOrUpdateDepartment(department);

        // 부모 부서가 있으면 설정
        if (parentDepartment) {
            departmentInfo.parent = parentDepartment;
            await this.departmentService.save(departmentInfo);
        }

        // 하위 부서가 있으면 재귀적으로 처리
        if (department.child_departments && department.child_departments.length > 0) {
            for (const childDepartment of department.child_departments) {
                await this.processDepartmentHierarchy(childDepartment, departmentInfo);
            }
        }

        return departmentInfo;
    }

    // 부서 생성 또는 업데이트 함수
    private async createOrUpdateDepartment(department: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity> {
        let departmentInfo = await this.departmentService.findDepartmentByMMSDepartmentId(department.id);
        if (departmentInfo) {
            departmentInfo.departmentName = department.department_name;
            departmentInfo.departmentCode = department.department_code;
            departmentInfo = await this.departmentService.save(departmentInfo);
        } else {
            const newDepartment = new DepartmentInfoEntity();
            newDepartment.mmsDepartmentId = department.id;
            newDepartment.departmentName = department.department_name;
            newDepartment.departmentCode = department.department_code;
            departmentInfo = await this.departmentService.save(newDepartment);
        }

        return departmentInfo;
    }
}