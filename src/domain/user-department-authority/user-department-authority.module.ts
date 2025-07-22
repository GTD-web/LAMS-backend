import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentAuthorityEntity } from './entities/user-department-authority.entity';
import { UserDepartmentAuthorityDomainService } from './services/user-department-authority-domain.service';

/**
 * 사용자-부서 권한 도메인 모듈
 */
@Module({
    imports: [TypeOrmModule.forFeature([UserDepartmentAuthorityEntity])],
    providers: [UserDepartmentAuthorityDomainService],
    exports: [UserDepartmentAuthorityDomainService],
})
export class UserDepartmentAuthorityModule {}
