import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayInfoEntity } from './entities/holiday-info.entity';
import { HolidayDomainService } from './services/holiday-domain.service';
import { HolidayApiService } from './services/holiday-api.service';
import { HolidayCronService } from './services/holiday-cron.service';

@Module({
    imports: [TypeOrmModule.forFeature([HolidayInfoEntity])],
    providers: [HolidayDomainService, HolidayApiService, HolidayCronService],
    exports: [HolidayDomainService, HolidayApiService, HolidayCronService],
})
export class HolidayModule {}
