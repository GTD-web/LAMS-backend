import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventInfoEntity } from './entities/event-info.entity';
import { EventInfoDomainService } from './services/event-info-domain.service';
import { EventInfoContextService } from './services/event-info-context.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventInfoEntity])],
    providers: [EventInfoDomainService, EventInfoContextService],
    exports: [EventInfoDomainService, EventInfoContextService],
})
export class EventInfoModule {}
