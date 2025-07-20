import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayInfoEntity } from './entities/holiday-info.entity';
import { HolidayDomainService } from './services/holiday-domain.service';
import { HolidayContextService } from './services/holiday-context.service';

@Module({
    imports: [TypeOrmModule.forFeature([HolidayInfoEntity])],
    providers: [HolidayDomainService, HolidayContextService],
    exports: [HolidayDomainService, HolidayContextService],
})
export class HolidayModule {}
