import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 부서 일반 비즈니스 서비스
 * - 일반 사용자가 접근할 수 있는 부서 관련 비즈니스 로직 처리
 * - 접근 권한 부서 조회, 권한 확인 등
 */
@Injectable()
export class DepartmentBusinessService {
    private readonly logger = new Logger(DepartmentBusinessService.name);

    constructor(private readonly departmentDomainService: DepartmentDomainService) {}

    /**
     * 접근 권한에 포함된 부서 조회
     */
    async getDepartmentByAccessAuthority(user: LamsUserEntity): Promise<DepartmentInfoEntity[]> {
        if (!user || !user.userId) {
            throw new BadRequestException('사용자 정보가 필요합니다.');
        }

        const departments = await this.departmentDomainService.findDepartmentsByAccessAuthority(user.userId);
        return departments;
    }

    /**
     * 권한이 있는 부서 조회
     */
    async getAuthorityDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId) {
            throw new BadRequestException('부서 ID는 필수입니다.');
        }

        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        return department;
    }

    // /**
    //  * 사용자의 부서 접근 권한 확인 - 단순 조회: 로그 불필요
    //  */
    // async checkAccessAuthority(userId: string, departmentId: string): Promise<boolean> {
    //     if (!userId || !departmentId) {
    //         throw new BadRequestException('사용자 ID와 부서 ID는 필수입니다.');
    //     }

    //     return await this.departmentDomainService.hasAccessAuthority(userId, departmentId);
    // }

    // /**
    //  * 사용자의 부서 검토 권한 확인 - 단순 조회: 로그 불필요
    //  */
    // async checkReviewAuthority(userId: string, departmentId: string): Promise<boolean> {
    //     if (!userId || !departmentId) {
    //         throw new BadRequestException('사용자 ID와 부서 ID는 필수입니다.');
    //     }

    //     return await this.departmentDomainService.hasReviewAuthority(userId, departmentId);
    // }

    // /**
    //  * MMS 동기화 (일반 사용자도 접근 가능) - 비즈니스 크리티컬: 로그 필요
    //  */
    // async syncMMS(): Promise<{ syncedCount: number; errorCount: number }> {
    //     const result = await this.departmentDomainService.syncWithMMS();
    //     this.logger.log(`MMS 동기화 완료: 성공 ${result.syncedCount}개, 실패 ${result.errorCount}개`);
    //     return result;
    // }

    // /**
    //  * 부서 계층 구조 조회 - 단순 조회: 로그 불필요
    //  */
    // async getDepartmentHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
    //     // TODO: 실제 도메인 서비스에 계층 구조 조회 메서드 추가 필요
    //     // return await this.departmentDomainService.findDepartmentHierarchy(departmentId);
    //     return [];
    // }

    // /**
    //  * 부서별 직원 수 조회 - 단순 조회: 로그 불필요
    //  */
    // async getDepartmentEmployeeCount(departmentId: string): Promise<number> {
    //     if (!departmentId) {
    //         throw new BadRequestException('부서 ID는 필수입니다.');
    //     }

    //     const department = await this.departmentDomainService.findDepartmentById(departmentId);
    //     if (!department) {
    //         throw new NotFoundException('부서를 찾을 수 없습니다.');
    //     }

    //     // TODO: 실제 도메인 서비스에 직원 수 조회 메서드 추가 필요
    //     // return await this.departmentDomainService.getEmployeeCount(departmentId);
    //     return 0;
    // }

    // /**
    //  * 부서 검색 - 단순 조회: 로그 불필요
    //  */
    // async searchDepartments(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
    //     if (!searchTerm || searchTerm.trim().length === 0) {
    //         throw new BadRequestException('검색어는 필수입니다.');
    //     }

    //     // TODO: 실제 도메인 서비스에 검색 메서드 추가 필요
    //     // if (userId) {
    //     //     // 사용자 권한이 있는 부서만 검색
    //     //     return await this.departmentDomainService.searchDepartmentsWithAuthority(searchTerm, userId);
    //     // } else {
    //     //     // 전체 부서 검색
    //     //     return await this.departmentDomainService.searchDepartments(searchTerm);
    //     // }
    //     return [];
    // }

    // /**
    //  * 부서 상태 확인 - 단순 조회: 로그 불필요
    //  */
    // async getDepartmentStatus(departmentId: string): Promise<{
    //     isActive: boolean;
    //     isExcluded: boolean;
    //     employeeCount: number;
    //     hasChildren: boolean;
    // }> {
    //     if (!departmentId) {
    //         throw new BadRequestException('부서 ID는 필수입니다.');
    //     }

    //     const department = await this.departmentDomainService.findDepartmentById(departmentId);
    //     if (!department) {
    //         throw new NotFoundException('부서를 찾을 수 없습니다.');
    //     }

    //     return {
    //         isActive: true, // TODO: 실제 활성 상태 확인
    //         isExcluded: department.isExclude,
    //         employeeCount: await this.getDepartmentEmployeeCount(departmentId),
    //         hasChildren: false, // TODO: 실제 하위 부서 존재 여부 확인
    //     };
    // }
}
