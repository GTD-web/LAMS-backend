// import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import axios from 'axios';
// import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
// import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
// import { MMSDepartmentResponseDto } from '../../interfaces/dto/organization/requests/mms-department-import.dto';
// import { MMSEmployeeResponseDto } from '../../interfaces/dto/organization/requests/mms-employee-import.dto';
// import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
// import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
// import { DepartmentEmployeeEntity } from '../../domain/organization/department/entities/department-employee.entity';

// // MMS 외부 시스템과의 통합을 담당하는 Context Service
// @Injectable()
// export class DepartmentImportContextService {
//     private readonly logger = new Logger(DepartmentImportContextService.name);
//     private readonly MMS_BASE_URL = 'https://lumir-metadata-manager.vercel.app';

//     constructor(
//         @InjectRepository(DepartmentEmployeeEntity)
//         private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
//         private readonly departmentDomainService: DepartmentDomainService,
//         private readonly employeeDomainService: EmployeeDomainService,
//     ) {}

//     /**
//      * MMS에서 직원 정보를 가져옵니다.
//      * @returns MMS 직원 정보 배열
//      */
//     async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
//         try {
//             const response = await axios.get(`${this.MMS_BASE_URL}/api/employees?detailed=true`);
//             this.logger.log(`MMS에서 ${response.data.length}명의 직원 정보를 가져왔습니다.`);
//             return response.data;
//         } catch (error) {
//             this.logger.error('MMS 직원 정보 조회 실패', error);
//             throw new Error('MMS 직원 정보를 가져오는데 실패했습니다.');
//         }
//     }

//     /**
//      * MMS에서 부서 정보를 가져옵니다.
//      * @returns MMS 부서 정보 배열 (계층 구조 포함)
//      */
//     async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
//         try {
//             const response = await axios.get(`${this.MMS_BASE_URL}/api/departments?hierarchy=true`);
//             this.logger.log(`MMS에서 ${response.data.length}개의 부서 정보를 가져왔습니다.`);
//             return response.data;
//         } catch (error) {
//             this.logger.error('MMS 부서 정보 조회 실패', error);
//             throw new Error('MMS 부서 정보를 가져오는데 실패했습니다.');
//         }
//     }

//     /**
//      * MMS와 로컬 시스템 간의 전체 동기화를 수행합니다.
//      */
//     async synchronizeWithMMS(): Promise<void> {
//         try {
//             this.logger.log('MMS 동기화 시작');

//             // MMS 데이터 가져오기
//             const [employees, departments] = await Promise.all([
//                 this.getEmployeesFromMMS(),
//                 this.getDepartmentsFromMMS(),
//             ]);

//             // 부서 동기화
//             const syncedDepartmentIds = await this.synchronizeDepartments(departments);

//             // 삭제된 부서 처리
//             await this.removeDeletedDepartments(syncedDepartmentIds);

//             // 직원 동기화
//             await this.synchronizeEmployees(employees);

//             this.logger.log('MMS 동기화 완료');
//         } catch (error) {
//             this.logger.error('MMS 동기화 실패', error);
//             throw error;
//         }
//     }

//     /**
//      * 부서 정보를 동기화합니다.
//      * @param departments MMS 부서 정보 배열
//      * @returns 동기화된 부서 ID 배열
//      */
//     private async synchronizeDepartments(departments: MMSDepartmentResponseDto[]): Promise<string[]> {
//         const syncedDepartmentIds: string[] = [];

//         // 최상위 부서부터 재귀적으로 처리
//         for (const department of departments) {
//             await this.processDepartmentHierarchy(department);
//             this.collectSyncedDepartmentIds(department, syncedDepartmentIds);
//         }

//         this.logger.log(`${syncedDepartmentIds.length}개 부서 동기화 완료`);
//         return syncedDepartmentIds;
//     }

//     /**
//      * 직원 정보를 동기화합니다.
//      * @param employees MMS 직원 정보 배열
//      */
//     private async synchronizeEmployees(employees: MMSEmployeeResponseDto[]): Promise<void> {
//         for (const employee of employees) {
//             try {
//                 // 직원 정보 생성/업데이트
//                 const employeeInfo = await this.createOrUpdateEmployee(employee);

//                 // 기존 부서-직원 관계 삭제
//                 await this.deleteDepartmentEmployeeRelationsByEmployeeId(employeeInfo.employeeId);

//                 // 재직 중인 직원의 부서 배치
//                 if (employee.department && employee.status === '재직중') {
//                     await this.assignEmployeeToDepartment(employeeInfo, employee.department._id);
//                 }
//             } catch (error) {
//                 this.logger.error(`직원 ${employee.name}(${employee.employee_number}) 동기화 실패`, error);
//                 continue; // 다른 직원 처리 계속
//             }
//         }

//         this.logger.log(`${employees.length}명의 직원 동기화 완료`);
//     }

//     /**
//      * 부서 계층 구조를 재귀적으로 처리합니다.
//      * @param department MMS 부서 정보
//      * @param parentDepartment 상위 부서 엔티티
//      * @returns 처리된 부서 엔티티
//      */
//     private async processDepartmentHierarchy(
//         department: MMSDepartmentResponseDto,
//         parentDepartment?: DepartmentInfoEntity,
//     ): Promise<DepartmentInfoEntity> {
//         // 현재 부서 생성 또는 업데이트
//         const departmentInfo = await this.createOrUpdateDepartment(department);

//         // 부모 부서 설정
//         if (parentDepartment) {
//             departmentInfo.parent = parentDepartment;
//             await this.departmentDomainService.saveDepartment(departmentInfo);
//         }

//         // 하위 부서 재귀 처리
//         if (department.child_departments && department.child_departments.length > 0) {
//             for (const childDepartment of department.child_departments) {
//                 await this.processDepartmentHierarchy(childDepartment, departmentInfo);
//             }
//         }

//         return departmentInfo;
//     }

//     /**
//      * 부서를 생성하거나 업데이트합니다.
//      * @param department MMS 부서 정보
//      * @returns 생성/업데이트된 부서 엔티티
//      */
//     private async createOrUpdateDepartment(department: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity> {
//         let departmentInfo = await this.departmentDomainService.findDepartmentByMMSDepartmentId(department.id);

//         if (departmentInfo) {
//             // 기존 부서 업데이트
//             departmentInfo.departmentName = department.department_name;
//             departmentInfo.departmentCode = department.department_code;
//             departmentInfo = await this.departmentDomainService.saveDepartment(departmentInfo);
//         } else {
//             // 새 부서 생성
//             const newDepartment = new DepartmentInfoEntity();
//             newDepartment.mmsDepartmentId = department.id;
//             newDepartment.departmentName = department.department_name;
//             newDepartment.departmentCode = department.department_code;
//             departmentInfo = await this.departmentDomainService.saveDepartment(newDepartment);
//         }

//         return departmentInfo;
//     }

//     /**
//      * 직원을 생성하거나 업데이트합니다.
//      * @param employee MMS 직원 정보
//      * @returns 생성/업데이트된 직원 엔티티
//      */
//     private async createOrUpdateEmployee(employee: MMSEmployeeResponseDto): Promise<EmployeeInfoEntity> {
//         let employeeInfo = await this.employeeDomainService.findEmployeeByEmployeeNumber(employee.employee_number);

//         if (employeeInfo) {
//             // 기존 직원 업데이트
//             employeeInfo.email = employee.email;
//             employeeInfo.entryAt = employee.hire_date ? employee.hire_date.split('T')[0] : null;
//             employeeInfo.birthDate = employee.date_of_birth ? employee.date_of_birth.split('T')[0] : null;
//             employeeInfo.quitedAt = employee.termination_date ? employee.termination_date.split('T')[0] : null;
//             employeeInfo = await this.employeeDomainService.updateEmployee(employeeInfo.employeeId, {
//                 email: employeeInfo.email,
//                 entryAt: employeeInfo.entryAt,
//                 birthDate: employeeInfo.birthDate,
//                 quitedAt: employeeInfo.quitedAt,
//             });
//         } else {
//             // 새 직원 생성
//             const newEmployeeData = {
//                 employeeName: employee.name,
//                 employeeNumber: employee.employee_number,
//                 email: employee.email,
//                 entryAt: employee.hire_date ? employee.hire_date.split('T')[0] : null,
//                 birthDate: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : null,
//                 quitedAt: employee.termination_date ? employee.termination_date.split('T')[0] : null,
//             };
//             employeeInfo = await this.employeeDomainService.createEmployee(newEmployeeData);
//         }

//         return employeeInfo;
//     }

//     /**
//      * 직원을 부서에 배치합니다.
//      * @param employee 직원 엔티티
//      * @param mmsDepartmentId MMS 부서 ID
//      */
//     private async assignEmployeeToDepartment(employee: EmployeeInfoEntity, mmsDepartmentId: string): Promise<void> {
//         const department = await this.departmentDomainService.findDepartmentByMMSDepartmentId(mmsDepartmentId);

//         if (department) {
//             const departmentEmployee = new DepartmentEmployeeEntity();
//             departmentEmployee.department = department;
//             departmentEmployee.employee = employee;
//             await this.departmentEmployeeRepository.save(departmentEmployee);
//         } else {
//             this.logger.warn(`부서를 찾을 수 없습니다: MMS ID ${mmsDepartmentId}`);
//         }
//     }

//     /**
//      * 직원의 부서 관계를 삭제합니다.
//      * @param employeeId 직원 ID
//      */
//     private async deleteDepartmentEmployeeRelationsByEmployeeId(employeeId: string): Promise<void> {
//         await this.departmentEmployeeRepository.delete({ employee: { employeeId } });
//     }

//     /**
//      * 동기화된 부서 ID를 재귀적으로 수집합니다.
//      * @param department MMS 부서 정보
//      * @param syncedIds 수집된 ID 배열
//      */
//     private collectSyncedDepartmentIds(department: MMSDepartmentResponseDto, syncedIds: string[]): void {
//         syncedIds.push(department.id);

//         if (department.child_departments && department.child_departments.length > 0) {
//             for (const childDepartment of department.child_departments) {
//                 this.collectSyncedDepartmentIds(childDepartment, syncedIds);
//             }
//         }
//     }

//     /**
//      * MMS에서 삭제된 부서를 로컬에서도 삭제합니다.
//      * @param syncedDepartmentIds 동기화된 부서 ID 배열
//      */
//     private async removeDeletedDepartments(syncedDepartmentIds: string[]): Promise<void> {
//         try {
//             const result = await this.departmentDomainService.findAllDepartmentsPaginated({ page: 1, limit: 1000 });

//             // MMS에서 삭제된 부서 찾기
//             const deletedDepartments = result.departments.filter(
//                 (department) =>
//                     !department.mmsDepartmentId ||
//                     (department.mmsDepartmentId && !syncedDepartmentIds.includes(department.mmsDepartmentId)),
//             );

//             if (deletedDepartments.length > 0) {
//                 this.logger.log(`삭제 대상 부서 발견: ${deletedDepartments.map((d) => d.departmentName).join(', ')}`);

//                 for (const department of deletedDepartments) {
//                     this.logger.log(`부서 삭제 처리 중: ${department.departmentName} (ID: ${department.departmentId})`);
//                     await this.departmentDomainService.deleteDepartment(department.departmentId);
//                     this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
//                 }
//             }
//         } catch (error) {
//             this.logger.error('삭제된 부서 처리 중 오류 발생', error);
//             throw error;
//         }
//     }
// }
