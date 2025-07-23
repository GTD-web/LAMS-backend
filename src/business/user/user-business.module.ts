import { Module } from '@nestjs/common';
import { UserBusinessService } from './user.business';
import { UserContextModule } from '../../contexts/user/user-context.module';
import { UserDepartmentAuthorityContextModule } from '../../contexts/user-department-authority/user-department-authority-context.module';

/**
 * 사용자 비즈니스 모듈
 * - 사용자 관리 비즈니스 로직을 처리
 * - 사용자 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Module({
    imports: [UserContextModule, UserDepartmentAuthorityContextModule],
    providers: [UserBusinessService],
    exports: [UserBusinessService],
})
export class UserBusinessModule {}
