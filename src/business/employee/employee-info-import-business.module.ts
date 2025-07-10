import { Module } from '@nestjs/common';
import { EmployeeInfoImportBusiness } from './employee-info-import.business';
import { EmployeeDomainModule } from '@src/domain/organization/employee/employee-domain.module';
import { EmployeeExcelImportDomainService } from '@src/domain/excel/employee-excel-import.domain';

/**
 * 직원 정보 가져오기 비즈니스 모듈
 */
@Module({
    imports: [EmployeeDomainModule],
    providers: [EmployeeInfoImportBusiness, EmployeeExcelImportDomainService],
    exports: [EmployeeInfoImportBusiness],
})
export class EmployeeInfoImportBusinessModule {}
