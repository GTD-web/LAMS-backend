import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayInfoEntity } from './entities/holiday-info.entity';
import { HolidayDomainService } from './services/holiday-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([HolidayInfoEntity])],
    providers: [HolidayDomainService],
    exports: [HolidayDomainService],
})
export class HolidayModule {}
