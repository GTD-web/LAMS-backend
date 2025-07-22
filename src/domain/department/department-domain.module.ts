import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentInfoEntity } from './entities/department-info.entity';
import { DepartmentDomainService } from './services/department-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentInfoEntity])],
    providers: [DepartmentDomainService],
    exports: [DepartmentDomainService],
})
export class DepartmentDomainModule {}
