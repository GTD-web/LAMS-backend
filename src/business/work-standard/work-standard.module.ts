import { Module } from '@nestjs/common';
import { WorkStandardController } from '../../interfaces/controllers/work-standard.controller';
import { WorkStandardBusinessService } from './work-standard.business';
import { WorkStandardContextModule } from '../../contexts/work-standard/work-standard-context.module';

@Module({
    imports: [WorkStandardContextModule],
    controllers: [WorkStandardController],
    providers: [WorkStandardBusinessService],
    exports: [WorkStandardBusinessService],
})
export class WorkStandardModule {}
