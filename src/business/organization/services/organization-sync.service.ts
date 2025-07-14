import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../../contexts/organization/organization-context.service';

/**
 * 조직 동기화 서비스
 * - MMS 외부 시스템과의 전체 동기화만 담당
 * - 부분 동기화는 지원하지 않음
 */
@Injectable()
export class OrganizationSyncService {
    constructor(private readonly organizationContextService: OrganizationContextService) {}

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
    async syncMMS(): Promise<{ success: boolean; message: string }> {
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
}
