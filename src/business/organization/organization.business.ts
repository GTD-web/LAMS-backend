import { Injectable, Logger } from '@nestjs/common';
import {
    OrganizationDomainService,
    OrganizationNodeData,
    OrganizationTreeNode,
} from '@src/domain/organization/organization-domain.service';

// 조직도 비즈니스 서비스 클래스
@Injectable()
export class OrganizationBusinessService {
    private readonly logger = new Logger(OrganizationBusinessService.name);

    constructor(private readonly organizationDomainService: OrganizationDomainService) {}

    /**
     * 조직도 전체 트리 조회
     */
    async getOrganizationTree(): Promise<OrganizationTreeNode[]> {
        try {
            return await this.organizationDomainService.getOrganizationTree();
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
            await this.organizationDomainService.saveOrganizationTree(organizationTree);
            this.logger.log('조직도 저장 완료');
        } catch (error) {
            this.logger.error('조직도 저장 실패', error.stack);
            throw error;
        }
    }
}
