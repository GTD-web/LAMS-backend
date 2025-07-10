import { Module } from '@nestjs/common';
import { DepartmentBusinessService } from './department.business';
import { DepartmentAdminBusinessService } from './department-admin.business';
import { DepartmentController } from './department.controller';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';

/**
 * 부서 비즈니스 모듈
 * - 부서 관련 비즈니스 로직 모듈
 * - 일반 사용자 및 관리자 서비스 제공
 */
@Module({
    controllers: [DepartmentController],
    providers: [DepartmentBusinessService, DepartmentAdminBusinessService, DepartmentDomainService],
    exports: [DepartmentBusinessService, DepartmentAdminBusinessService],
})
export class DepartmentBusinessModule {}
