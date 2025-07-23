import { Module } from '@nestjs/common';
import { WorkStandardBusinessModule } from 'src/business/work-standard/work-standard-business.module';
import { WorkStandardController } from './work-standard.controller';

@Module({
    imports: [WorkStandardBusinessModule],
    controllers: [WorkStandardController],
})
export class WorkStandardInterfaceModule {}
