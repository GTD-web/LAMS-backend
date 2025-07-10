import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentBusinessService } from './department.business';
import { DepartmentAdminBusinessService } from './department-admin.business';
import { DepartmentController } from './department.controller';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { DepartmentRepository } from '@src/domain/organization/department/repositories/department.repository';

/**
 * 부서 비즈니스 모듈
 * - 부서 관련 비즈니스 로직 모듈
 * - 일반 사용자 및 관리자 서비스 제공
 */
@Module({
    imports: [TypeOrmModule.forFeature([DepartmentInfoEntity, DepartmentEmployeeEntity])],
    controllers: [DepartmentController],
    providers: [
        DepartmentBusinessService,
        DepartmentAdminBusinessService,
        DepartmentDomainService,
        {
            provide: 'IDepartmentRepository',
            useClass: DepartmentRepository,
        },
    ],
    exports: [DepartmentBusinessService, DepartmentAdminBusinessService],
})
export class DepartmentBusinessModule {}
