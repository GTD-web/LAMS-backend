import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceTypeEntity } from './entities/attendance-type.entity';
import { AttendanceTypeDomainService } from './services/attendance-type-domain.service';
import { AttendanceTypeContextService } from './services/attendance-type-context.service';

@Module({
    imports: [TypeOrmModule.forFeature([AttendanceTypeEntity])],
    providers: [AttendanceTypeDomainService, AttendanceTypeContextService],
    exports: [AttendanceTypeDomainService, AttendanceTypeContextService],
})
export class AttendanceTypeModule {}
