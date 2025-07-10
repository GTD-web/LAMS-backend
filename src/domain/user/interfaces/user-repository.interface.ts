import { LamsUserEntity } from '../entities/lams-user.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';

/**
 * 사용자 리포지토리 인터페이스
 * - 사용자 데이터 접근 계층의 계약 정의
 */
export interface IUserRepository {
    /**
     * 사용자 생성
     */
    create(userData: Partial<LamsUserEntity>): Promise<LamsUserEntity>;

    /**
     * 사용자 저장
     */
    save(user: LamsUserEntity): Promise<LamsUserEntity>;

    /**
     * 사용자 ID로 조회
     */
    findByUserId(userId: string): Promise<LamsUserEntity | null>;

    /**
     * 이메일로 조회
     */
    findByEmail(email: string): Promise<LamsUserEntity | null>;

    /**
     * 사용자명으로 조회
     */
    findByUsername(username: string): Promise<LamsUserEntity | null>;

    /**
     * 모든 사용자 조회 (페이지네이션)
     */
    findAll(query: PaginationQueryDto): Promise<{
        users: LamsUserEntity[];
        total: number;
    }>;

    /**
     * 사용자 업데이트
     */
    updateUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity>;

    /**
     * 사용자 삭제
     */
    deleteUser(userId: string): Promise<boolean>;

    /**
     * 사용자 존재 여부 확인
     */
    exists(userId: string): Promise<boolean>;

    /**
     * 이메일 중복 확인
     */
    existsByEmail(email: string, excludeId?: string): Promise<boolean>;

    /**
     * 사용자명 중복 확인
     */
    existsByUsername(username: string, excludeId?: string): Promise<boolean>;

    /**
     * 역할별 사용자 조회
     */
    findByRole(role: string): Promise<LamsUserEntity[]>;

    /**
     * 활성 사용자 조회
     */
    findActiveUsers(): Promise<LamsUserEntity[]>;

    /**
     * 비활성 사용자 조회
     */
    findInactiveUsers(): Promise<LamsUserEntity[]>;
}

/**
 * LAMS 사용자 리포지토리 인터페이스
 * - LAMS 시스템 사용자 데이터 접근 계층의 계약 정의
 */
export interface ILamsUserRepository {
    /**
     * LAMS 사용자 생성
     */
    create(userData: Partial<LamsUserEntity>): Promise<LamsUserEntity>;

    /**
     * LAMS 사용자 저장
     */
    save(user: LamsUserEntity): Promise<LamsUserEntity>;

    /**
     * 사용자 ID로 조회
     */
    findByUserId(userId: string): Promise<LamsUserEntity | null>;

    /**
     * 이메일로 조회
     */
    findByEmail(email: string): Promise<LamsUserEntity | null>;

    /**
     * 사용자명으로 조회
     */
    findByUsername(username: string): Promise<LamsUserEntity | null>;

    /**
     * 모든 LAMS 사용자 조회 (페이지네이션)
     */
    findAll(query: PaginationQueryDto): Promise<{
        users: LamsUserEntity[];
        total: number;
    }>;

    /**
     * LAMS 사용자 업데이트
     */
    updateUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity>;

    /**
     * LAMS 사용자 삭제
     */
    deleteUser(userId: string): Promise<boolean>;

    /**
     * LAMS 사용자 존재 여부 확인
     */
    exists(userId: string): Promise<boolean>;

    /**
     * 이메일 중복 확인
     */
    existsByEmail(email: string, excludeId?: string): Promise<boolean>;

    /**
     * 사용자명 중복 확인
     */
    existsByUsername(username: string, excludeId?: string): Promise<boolean>;

    /**
     * 역할별 LAMS 사용자 조회
     */
    findByRole(role: string): Promise<LamsUserEntity[]>;

    /**
     * 활성 LAMS 사용자 조회
     */
    findActiveUsers(): Promise<LamsUserEntity[]>;

    /**
     * 비활성 LAMS 사용자 조회
     */
    findInactiveUsers(): Promise<LamsUserEntity[]>;
}
