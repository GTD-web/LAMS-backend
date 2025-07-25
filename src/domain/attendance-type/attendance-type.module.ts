import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceTypeEntity } from './entities/attendance-type.entity';
import { AttendanceTypeDomainService } from './services/attendance-type-domain.service';
import { AttendanceTypeSeedService } from './services/attendance-type-seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([AttendanceTypeEntity])],
    providers: [AttendanceTypeDomainService, AttendanceTypeSeedService],
    exports: [AttendanceTypeDomainService, AttendanceTypeSeedService],
})
export class AttendanceTypeModule {}
