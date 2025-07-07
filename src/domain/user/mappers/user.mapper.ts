import { UserEntity } from '../entities/user.entity';
import { LamsUserEntity } from '../entities/lams-user.entity';
import { SignUpDto } from '@src/interfaces/http/dtos/user/requests/create-lams-user.dto';
import { UpdateUserDto, ChangePasswordDto } from '@src/interfaces/http/dtos/user/requests/update-lams-user.dto';

/**
 * 사용자 매퍼 클래스
 * - DTO와 Domain Entity 간의 변환을 담당
 * - 응답 데이터 매핑 (민감한 정보 제거)
 */
export class UserMapper {
    /**
     * SignUpDto에서 필요한 정보 추출
     * @param dto 사용자 생성 DTO
     * @returns 추출된 사용자 정보
     */
    static fromSignUpDto(dto: SignUpDto) {
        return {
            username: dto.username,
            email: dto.email,
            password: dto.password,
        };
    }

    /**
     * UpdateUserDto에서 필요한 정보 추출
     * @param dto 사용자 업데이트 DTO
     * @returns 추출된 업데이트 정보
     */
    static fromUpdateUserDto(dto: UpdateUserDto) {
        return {
            username: dto.username,
            password: dto.password,
        };
    }

    /**
     * ChangePasswordDto에서 필요한 정보 추출
     * @param dto 비밀번호 변경 DTO
     * @returns 추출된 비밀번호 정보
     */
    static fromChangePasswordDto(dto: ChangePasswordDto) {
        return {
            newPassword: dto.password,
        };
    }

    /**
     * UserEntity를 응답 형태로 변환 (민감한 정보 제거)
     * @param user 사용자 엔티티
     * @returns 응답용 사용자 정보
     */
    static toUserResponse(user: UserEntity): Partial<UserEntity> {
        const { password, ...userResponse } = user;
        return userResponse;
    }

    /**
     * LamsUserEntity를 응답 형태로 변환 (민감한 정보 제거)
     * @param user LAMS 사용자 엔티티
     * @returns 응답용 LAMS 사용자 정보
     */
    static toLamsUserResponse(user: LamsUserEntity): Partial<LamsUserEntity> {
        const { password, ...userResponse } = user;
        return userResponse;
    }

    /**
     * 사용자 엔티티 배열을 응답 형태로 변환
     * @param users 사용자 엔티티 배열
     * @returns 응답용 사용자 정보 배열
     */
    static toUserResponseArray(users: UserEntity[]): Partial<UserEntity>[] {
        return users.map((user) => this.toUserResponse(user));
    }

    /**
     * 사용자 역할만 응답 형태로 변환
     * @param user 사용자 엔티티
     * @returns 사용자 역할 정보
     */
    static toUserRoleResponse(user: UserEntity) {
        return {
            userId: user.userId,
            username: user.username,
            roles: user.roles,
        };
    }
}
