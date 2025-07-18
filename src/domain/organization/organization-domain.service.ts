import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';

// Ï°∞ÏßÅ???ÑÎ©î???úÎπÑ???¥Îûò??
@Injectable()
export class OrganizationDomainService {
    private readonly logger = new Logger(OrganizationDomainService.name);

    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        private readonly dataSource: DataSource,
    ) {}
}
