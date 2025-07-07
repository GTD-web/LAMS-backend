import { UserEntity } from '../entities/user.entity';
import { LamsUserEntity } from '../entities/lams-user.entity';
import { PaginationQueryDto } from '@src/libs/dtos/pagination/pagination-query.dto';

/**
 * 사용자 도메인 리포지토리 인터페이스
 * - 사용자 엔티티에 대한 데이터 접근 계약을 정의
 * - 도메인 계층에서 인프라스트럭처 계층에 대한 의존성을 추상화
 */
export interface IUserDomainRepository {
    /**
     * 사용자 ID로 사용자 조회
     * @param userId 사용자 ID
     * @returns 사용자 엔티티 또는 null
     */
    findByUserId(userId: string): Promise<UserEntity | null>;

    /**
     * 사용자명으로 사용자 조회
     * @param username 사용자명
     * @returns 사용자 엔티티 또는 null
     */
    findByUsername(username: string): Promise<UserEntity | null>;

    /**
     * 이메일로 사용자 조회
     * @param email 이메일
     * @returns 사용자 엔티티 또는 null
     */
    findByEmail(email: string): Promise<UserEntity | null>;

    /**
     * 모든 사용자 조회
     * @returns 사용자 엔티티 배열
     */
    findAndCount(query: PaginationQueryDto): Promise<{ users: UserEntity[]; total: number }>;

    /**
     * 사용자 업데이트
     * @param userId 사용자 ID
     * @param user 업데이트할 사용자 정보
     * @returns 업데이트된 사용자 엔티티
     */
    update(userId: string, user: Partial<UserEntity>): Promise<UserEntity>;

    /**
     * LAMS 사용자 조회 (관계 포함)
     * @param userId 사용자 ID
     * @returns LAMS 사용자 엔티티 또는 null
     */
    findLamsUserById(userId: string): Promise<LamsUserEntity | null>;

    /**
     * 사용자 생성
     * @param user 사용자 엔티티
     * @returns 생성된 사용자 엔티티
     */
    create(user: UserEntity): Promise<UserEntity>;

    /**
     * 사용자 삭제
     * @param userId 사용자 ID
     * @returns 삭제 성공 여부
     */
    delete(userId: string): Promise<boolean>;

    /**
     * LAMS 사용자 생성
     * @param user LAMS 사용자 엔티티
     * @returns 생성된 LAMS 사용자 엔티티
     */
    createLamsUser(user: LamsUserEntity): Promise<LamsUserEntity>;
}
