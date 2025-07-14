import { Module } from '@nestjs/common';
import { DepartmentDomainService } from './services/department-domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentInfoEntity } from './entities/department-info.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentInfoEntity])],
    providers: [DepartmentDomainService],
    exports: [DepartmentDomainService],
})
export class DepartmentDomainModule {}
