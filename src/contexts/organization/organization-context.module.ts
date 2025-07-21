import { Module } from '@nestjs/common';
import { OrganizationContextService } from './organization-context.service';
import { OrganizationDomainModule } from '../../domain/organization/organization-domain.module';

/**
 * 조직 컨텍스트 모듈
 * - 조직 관련 컨텍스트 서비스 제공
 * - 도메인 모듈들을 통합하여 비즈니스 로직 조정
 */
@Module({
    imports: [OrganizationDomainModule],
    providers: [OrganizationContextService],
    exports: [OrganizationContextService],
})
export class OrganizationContextModule {}
