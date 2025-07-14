import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../../contexts/organization/organization-context.service';
import { MMSDepartmentResponseDto } from '../../../interfaces/dto/organization/requests/mms-department-import.dto';
import { MMSEmployeeResponseDto } from '../../../interfaces/dto/organization/requests/mms-employee-import.dto';

/**
 * 조직 동기화 서비스
 * - MMS 외부 시스템과의 전체 동기화만 담당
 * - 부분 동기화는 지원하지 않음
 */
@Injectable()
export class OrganizationSyncService {
    constructor(private readonly organizationContextService: OrganizationContextService) {}

    /**
     * MMS에서 부서 데이터 가져오기 (조회용)
     */
    async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
        return await this.organizationContextService.getDepartmentsFromMMS();
    }

    /**
     * MMS에서 직원 데이터 가져오기 (조회용)
     */
    async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
        return await this.organizationContextService.getEmployeesFromMMS();
    }

    /**
     * MMS와 전체 동기화 실행
     * - 부서와 직원을 모두 동기화
     */
    async synchronizeWithMMS(): Promise<void> {
        await this.organizationContextService.synchronizeWithMMS();
    }

    /**
     * 전체 동기화 실행 (에러 처리 포함)
     */
    async performFullSync(): Promise<{ success: boolean; message: string }> {
        try {
            await this.synchronizeWithMMS();
            return {
                success: true,
                message: 'MMS 동기화가 성공적으로 완료되었습니다.',
            };
        } catch (error) {
            return {
                success: false,
                message: `MMS 동기화 중 오류가 발생했습니다: ${error.message}`,
            };
        }
    }

    /**
     * 동기화 상태 확인
     */
    async checkSyncStatus(): Promise<{
        mmsConnection: boolean;
        lastSyncTime?: Date;
        departmentCount: number;
        employeeCount: number;
    }> {
        try {
            const departments = await this.getDepartmentsFromMMS();
            const employees = await this.getEmployeesFromMMS();

            return {
                mmsConnection: true,
                lastSyncTime: new Date(),
                departmentCount: departments.length,
                employeeCount: employees.length,
            };
        } catch (error) {
            return {
                mmsConnection: false,
                departmentCount: 0,
                employeeCount: 0,
            };
        }
    }
}
