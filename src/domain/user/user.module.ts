import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './services/user-domain.service';

/**
 * ?¬μ©???λ©??λͺ¨λ
 * - ?¬μ©???λ©??κ³μΈ΅??μ»΄ν¬?νΈ?€μ κ΄λ¦?
 * - Repository ?¨ν΄???κ±°?κ³  Domain Service?μ μ§μ  TypeORM ?¬μ©
 */
@Module({
    imports: [TypeOrmModule.forFeature([LamsUserEntity])],
    providers: [UserDomainService],
    exports: [UserDomainService],
})
export class UserDomainModule {}
