import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';

/**
 * 부서 리포지토리 인터페이스
 * - 부서 데이터 접근 계층의 계약 정의
 */
export interface IDepartmentRepository {
    /**
     * 부서 생성
     */
    create(department: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity>;

    /**
     * 부서 ID로 조회
     */
    findById(departmentId: string): Promise<DepartmentInfoEntity | null>;

    /**
     * 부서 코드로 조회
     */
    findByCode(departmentCode: string): Promise<DepartmentInfoEntity | null>;

    /**
     * 부서 이름으로 조회
     */
    findByName(departmentName: string): Promise<DepartmentInfoEntity | null>;

    /**
     * 모든 부서 조회 (페이지네이션)
     */
    findAll(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{
        departments: DepartmentInfoEntity[];
        total: number;
    }>;

    /**
     * 사용자 접근 권한이 있는 부서 조회
     */
    findByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]>;

    /**
     * 사용자 검토 권한이 있는 부서 조회
     */
    findByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]>;

    /**
     * 부서 업데이트
     */
    update(departmentId: string, updateData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity>;

    /**
     * 부서 삭제
     */
    delete(departmentId: string): Promise<boolean>;

    /**
     * 부서 저장
     */
    save(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity>;

    /**
     * 부서 검색
     */
    search(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]>;

    /**
     * 부서 계층 구조 조회
     */
    findHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]>;

    /**
     * 하위 부서 조회
     */
    findChildren(departmentId: string): Promise<DepartmentInfoEntity[]>;

    /**
     * 상위 부서 조회
     */
    findParent(departmentId: string): Promise<DepartmentInfoEntity | null>;

    /**
     * 부서 존재 여부 확인
     */
    exists(departmentId: string): Promise<boolean>;

    /**
     * 부서 코드 중복 확인
     */
    existsByCode(departmentCode: string, excludeId?: string): Promise<boolean>;

    /**
     * 부서 이름 중복 확인
     */
    existsByName(departmentName: string, excludeId?: string): Promise<boolean>;
}
