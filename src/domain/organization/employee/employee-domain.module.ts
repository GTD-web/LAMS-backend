import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeInfoEntity } from './entities/employee-info.entity';
import { EmployeeDomainService } from './services/employee-domain.service';
import { EmployeeDomainRepository } from './repositories/employee-domain.repository';
import { UsedAttendanceEntity } from '@src/domain/attendance/used-attendance/entities/used-attendance.entity';
import { EventInfoEntity } from '@src/domain/event-info/entities/event-info.entity';
import { AttendanceTypeEntity } from '@src/domain/attendance/attendance-type/entities/attendance-type.entity';
import { EmployeeAnnualLeaveEntity } from '@src/domain/annual-leave/entities/employee-annual-leave.entity';
import { DepartmentInfoEntity } from '../department/entities/department-info.entity';

/**
 * 직원 도메인 모듈
 * - 직원 도메인 계층의 컴포넌트들을 관리
 * - 필요한 엔티티들과 서비스들을 제공
 */
@Module({
    imports: [TypeOrmModule.forFeature([EmployeeInfoEntity])],
    providers: [EmployeeDomainService, EmployeeDomainRepository],
    exports: [EmployeeDomainService, EmployeeDomainRepository],
})
export class EmployeeDomainModule {}
