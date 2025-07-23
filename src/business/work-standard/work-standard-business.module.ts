import { Module } from '@nestjs/common';
import { WorkStandardBusinessService } from './work-standard.business';
import { WorkStandardContextModule } from '../../contexts/work-standard/work-standard-context.module';

@Module({
    imports: [WorkStandardContextModule],
    providers: [WorkStandardBusinessService],
    exports: [WorkStandardBusinessService],
})
export class WorkStandardBusinessModule {}
