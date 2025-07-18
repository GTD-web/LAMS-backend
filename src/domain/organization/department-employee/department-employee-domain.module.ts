import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEmployeeEntity } from '../department/entities/department-employee.entity';
import { DepartmentEmployeeDomainService } from './department-employee-domain.service';

/**
 * 부서-직원 관계 도메인 모듈
 * - 부서와 직원 간의 관계 관리를 위한 도메인 모듈
 * - 중간테이블 처리 로직 제공
 */
@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEmployeeEntity])],
    providers: [DepartmentEmployeeDomainService],
    exports: [DepartmentEmployeeDomainService],
})
export class DepartmentEmployeeDomainModule {}
