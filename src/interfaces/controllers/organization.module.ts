import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationBusinessModule } from '../../business/organization/organization-business.module';

/**
 * 조직관리 인터페이스 모듈
 */
@Module({
    imports: [OrganizationBusinessModule],
    controllers: [OrganizationController],
})
export class OrganizationModule {}
