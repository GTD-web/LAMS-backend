import { Module } from '@nestjs/common';
import { EmployeeBusinessService } from './employee-business';
import { EmployeeDomainModule } from '@src/domain/organization/employee/employee-domain.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

/**
 * 직원 비즈니스 모듈
 * - 직원 비즈니스 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [EmployeeDomainModule, EventEmitterModule.forRoot()],
    providers: [EmployeeBusinessService],
    exports: [EmployeeBusinessService],
})
export class EmployeeBusinessModule {}
