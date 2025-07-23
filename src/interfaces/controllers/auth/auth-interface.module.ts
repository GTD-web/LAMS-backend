import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthBusinessModule } from 'src/business/auth/auth-business.module';

@Module({
    imports: [AuthBusinessModule],
    controllers: [AuthController],
    providers: [],
    exports: [],
})
export class AuthInterfaceModule {}
