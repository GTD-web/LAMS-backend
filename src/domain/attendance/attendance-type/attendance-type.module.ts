import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceTypeEntity } from './entities/attendance-type.entity';
import { AttendanceTypeDomainService } from './services/attendance-type-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([AttendanceTypeEntity])],
    providers: [AttendanceTypeDomainService],
    exports: [AttendanceTypeDomainService],
})
export class AttendanceTypeModule {}
