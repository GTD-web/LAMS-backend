import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeInfoEntity } from './entities/employee-info.entity';
import { EmployeeDomainService } from './services/employee-domain.service';

/**
 * 직원 도메인 모듈
 * - 직원 도메인 계층의 컴포넌트들을 관리
 * - Repository 패턴을 제거하고 Domain Service에서 직접 TypeORM 사용
 */
@Module({
    imports: [TypeOrmModule.forFeature([EmployeeInfoEntity])],
    providers: [EmployeeDomainService],
    exports: [EmployeeDomainService],
})
export class EmployeeDomainModule {}
