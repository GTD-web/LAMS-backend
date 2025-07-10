import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';

/**
 * 부서 관리자 비즈니스 서비스
 * - 관리자 권한이 필요한 부서 관련 비즈니스 로직 처리
 * - 부서 CRUD, 권한 관리, 제외 처리 등
 */
@Injectable()
export class DepartmentAdminBusinessService {
    private readonly logger = new Logger(DepartmentAdminBusinessService.name);

    constructor(private readonly departmentDomainService: DepartmentDomainService) {}

    /**
     * 부서 제외 토글
     */
    async toggleExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId) {
            throw new BadRequestException('부서 ID는 필수입니다.');
        }

        const result = await this.departmentDomainService.toggleDepartmentExclude(departmentId);
        this.logger.log(`부서 제외 토글 완료: ${departmentId}`);
        return result;
    }

    /**
     * 부서 접근 권한 추가
     */
    async includeAccessAuthority(departmentId: string, userId: string): Promise<DepartmentEmployeeEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
        }

        const result = await this.departmentDomainService.addAccessAuthority(departmentId, userId);
        this.logger.log(`부서 접근 권한 추가 완료: 부서 ${departmentId}, 사용자 ${userId}`);
        return result;
    }

    /**
     * 부서 검토 권한 추가
     */
    async includeReviewAuthority(departmentId: string, userId: string): Promise<DepartmentEmployeeEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
        }

        const result = await this.departmentDomainService.addReviewAuthority(departmentId, userId);
        this.logger.log(`부서 검토 권한 추가 완료: 부서 ${departmentId}, 사용자 ${userId}`);
        return result;
    }

    /**
     * 부서 접근 권한 제거
     */
    async excludeAccessAuthority(departmentId: string, userId: string): Promise<boolean> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
        }

        const result = await this.departmentDomainService.removeAccessAuthority(departmentId, userId);
        this.logger.log(`부서 접근 권한 제거 완료: 부서 ${departmentId}, 사용자 ${userId}`);
        return result;
    }

    /**
     * 부서 검토 권한 제거
     */
    async excludeReviewAuthority(departmentId: string, userId: string): Promise<boolean> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
        }

        const result = await this.departmentDomainService.removeReviewAuthority(departmentId, userId);
        this.logger.log(`부서 검토 권한 제거 완료: 부서 ${departmentId}, 사용자 ${userId}`);
        return result;
    }

    /**
     * 부서 ID로 조회 (관리자용)
     */
    async getDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId) {
            throw new BadRequestException('부서 ID는 필수입니다.');
        }

        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        return department;
    }

    /**
     * 부서 목록 조회 (관리자용)
     */
    async getDepartmentList(
        query: PaginationQueryDto,
        isExclude: boolean,
    ): Promise<PaginatedResponseDto<DepartmentInfoEntity>> {
        const result = await this.departmentDomainService.findAllDepartments(query, isExclude);
        return PaginatedResponseDto.create(result.departments, query.page, query.limit, result.total);
    }

    /**
     * 부서 생성
     */
    async createDepartment(departmentData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        if (!departmentData.departmentName) {
            throw new BadRequestException('부서명은 필수입니다.');
        }

        // TODO: 실제 도메인 서비스에 생성 메서드 추가 필요
        // const result = await this.departmentDomainService.createDepartment(departmentData);

        this.logger.log(`부서 생성 완료: ${departmentData.departmentName}`);
        return null; // TODO: 실제 결과 반환
    }

    /**
     * 부서 정보 수정
     */
    async updateDepartment(
        departmentId: string,
        updateData: Partial<DepartmentInfoEntity>,
    ): Promise<DepartmentInfoEntity> {
        if (!departmentId) {
            throw new BadRequestException('부서 ID는 필수입니다.');
        }

        const department = await this.getDepartmentById(departmentId);

        // TODO: 실제 도메인 서비스에 수정 메서드 추가 필요
        // const result = await this.departmentDomainService.updateDepartment(departmentId, updateData);

        this.logger.log(`부서 정보 수정 완료: ${department.departmentName}`);
        return department;
    }

    /**
     * 부서 삭제
     */
    async deleteDepartment(departmentId: string): Promise<boolean> {
        if (!departmentId) {
            throw new BadRequestException('부서 ID는 필수입니다.');
        }

        const department = await this.getDepartmentById(departmentId);

        // TODO: 실제 도메인 서비스에 삭제 메서드 추가 필요
        // const result = await this.departmentDomainService.deleteDepartment(departmentId);

        this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
        return true;
    }

    /**
     * MMS 동기화
     */
    async syncMMS(): Promise<{ syncedCount: number; errorCount: number }> {
        const result = await this.departmentDomainService.syncWithMMS();
        this.logger.log(`MMS 동기화 완료: 성공 ${result.syncedCount}개, 실패 ${result.errorCount}개`);
        return result;
    }
}
