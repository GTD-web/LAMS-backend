import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../entities/department-employee.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { DepartmentRepository } from '../repositories/department.repository';

/**
 * 부서 도메인 서비스
 * - 부서 관련 핵심 도메인 로직 처리
 * - 부서 정보 조회, 권한 관리, 제외 처리 등
 */
@Injectable()
export class DepartmentDomainService {
    private readonly logger = new Logger(DepartmentDomainService.name);

    constructor(private readonly departmentRepository: DepartmentRepository) {}

    /**
     * 부서 ID로 조회
     */
    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            return await this.departmentRepository.findById(departmentId);
        } catch (error) {
            this.logger.error('부서 ID로 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 접근 권한 부서 조회
     */
    async findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        try {
            if (!userId) {
                throw new BadRequestException('사용자 ID는 필수입니다.');
            }

            return await this.departmentRepository.findByAccessAuthority(userId);
        } catch (error) {
            this.logger.error('접근 권한 부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 목록 조회 (페이지네이션)
     */
    async findAllDepartments(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        try {
            const skip = (query.page - 1) * query.limit;
            const take = query.limit;

            const departments = await this.departmentRepository.findAll(skip, take);
            const total = await this.departmentRepository.count();

            return { departments, total };
        } catch (error) {
            this.logger.error('부서 목록 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 제외 토글
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            // TODO: 실제 repository 연결 필요
            // department.isExcludedFromCallList = !department.isExcludedFromCallList;
            // const updatedDepartment = await this.departmentRepository.save(department);

            this.logger.log(`부서 제외 토글 완료: ${department.departmentName} - 제외 여부: ${department.isExclude}`);
            return department;
        } catch (error) {
            this.logger.error('부서 제외 토글 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 접근 권한 추가
     */
    async addAccessAuthority(departmentId: string, userId: string): Promise<DepartmentEmployeeEntity> {
        try {
            if (!departmentId || !userId) {
                throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
            }

            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            // 중복 권한 확인
            const existingAuthority = await this.findDepartmentEmployeeByUserAndDepartment(userId, departmentId);
            if (existingAuthority) {
                throw new BadRequestException('이미 접근 권한이 있는 사용자입니다.');
            }

            // TODO: 실제 repository 연결 필요
            // const departmentEmployee = new DepartmentEmployeeEntity();
            // departmentEmployee.userId = userId;
            // departmentEmployee.departmentId = departmentId;
            // departmentEmployee.hasAccessAuthority = true;
            // const savedAuthority = await this.departmentEmployeeRepository.save(departmentEmployee);

            this.logger.log(`부서 접근 권한 추가 완료: 부서 ${departmentId}, 사용자 ${userId}`);
            return null; // TODO: 실제 엔티티 반환
        } catch (error) {
            this.logger.error('부서 접근 권한 추가 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 검토 권한 추가
     */
    async addReviewAuthority(departmentId: string, userId: string): Promise<DepartmentEmployeeEntity> {
        try {
            if (!departmentId || !userId) {
                throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
            }

            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            // 기존 권한 확인 및 업데이트
            let departmentEmployee = await this.findDepartmentEmployeeByUserAndDepartment(userId, departmentId);
            if (!departmentEmployee) {
                // TODO: 새로운 권한 엔티티 생성
                // departmentEmployee = new DepartmentEmployeeEntity();
                // departmentEmployee.userId = userId;
                // departmentEmployee.departmentId = departmentId;
            }

            // TODO: 실제 repository 연결 필요
            // departmentEmployee.hasReviewAuthority = true;
            // const savedAuthority = await this.departmentEmployeeRepository.save(departmentEmployee);

            this.logger.log(`부서 검토 권한 추가 완료: 부서 ${departmentId}, 사용자 ${userId}`);
            return departmentEmployee;
        } catch (error) {
            this.logger.error('부서 검토 권한 추가 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 접근 권한 제거
     */
    async removeAccessAuthority(departmentId: string, userId: string): Promise<boolean> {
        try {
            if (!departmentId || !userId) {
                throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
            }

            const departmentEmployee = await this.findDepartmentEmployeeByUserAndDepartment(userId, departmentId);
            if (!departmentEmployee) {
                throw new NotFoundException('부서 권한을 찾을 수 없습니다.');
            }

            // TODO: 실제 repository 연결 필요
            // departmentEmployee.hasAccessAuthority = false;
            // await this.departmentEmployeeRepository.save(departmentEmployee);

            this.logger.log(`부서 접근 권한 제거 완료: 부서 ${departmentId}, 사용자 ${userId}`);
            return true;
        } catch (error) {
            this.logger.error('부서 접근 권한 제거 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 검토 권한 제거
     */
    async removeReviewAuthority(departmentId: string, userId: string): Promise<boolean> {
        try {
            if (!departmentId || !userId) {
                throw new BadRequestException('부서 ID와 사용자 ID는 필수입니다.');
            }

            const departmentEmployee = await this.findDepartmentEmployeeByUserAndDepartment(userId, departmentId);
            if (!departmentEmployee) {
                throw new NotFoundException('부서 권한을 찾을 수 없습니다.');
            }

            // TODO: 실제 repository 연결 필요
            // departmentEmployee.hasReviewAuthority = false;
            // await this.departmentEmployeeRepository.save(departmentEmployee);

            this.logger.log(`부서 검토 권한 제거 완료: 부서 ${departmentId}, 사용자 ${userId}`);
            return true;
        } catch (error) {
            this.logger.error('부서 검토 권한 제거 실패', error.stack);
            throw error;
        }
    }

    /**
     * MMS 동기화
     */
    async syncWithMMS(): Promise<{ syncedCount: number; errorCount: number }> {
        try {
            // TODO: 실제 MMS 동기화 로직 구현
            const syncResult = { syncedCount: 0, errorCount: 0 };

            this.logger.log(`MMS 동기화 완료: 성공 ${syncResult.syncedCount}개, 실패 ${syncResult.errorCount}개`);
            return syncResult;
        } catch (error) {
            this.logger.error('MMS 동기화 실패', error.stack);
            throw error;
        }
    }

    /**
     * 사용자와 부서의 권한 관계 조회 - 내부 헬퍼 메서드
     */
    private async findDepartmentEmployeeByUserAndDepartment(
        userId: string,
        departmentId: string,
    ): Promise<DepartmentEmployeeEntity | null> {
        try {
            // TODO: 실제 repository 연결 필요
            // return await this.departmentEmployeeRepository.findByUserAndDepartment(userId, departmentId);
            return null;
        } catch (error) {
            this.logger.error('부서 직원 권한 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 사용자가 부서에 접근 권한이 있는지 확인
     */
    async hasAccessAuthority(userId: string, departmentId: string): Promise<boolean> {
        try {
            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                return false;
            }

            // TODO: 실제 사용자 엔티티 조회 필요
            // const user = await this.userRepository.findById(userId);
            // return department.isAccessAuthority(user);
            return false;
        } catch (error) {
            this.logger.error('부서 접근 권한 확인 실패', error.stack);
            return false;
        }
    }

    /**
     * 사용자가 부서에 검토 권한이 있는지 확인
     */
    async hasReviewAuthority(userId: string, departmentId: string): Promise<boolean> {
        try {
            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                return false;
            }

            // TODO: 실제 사용자 엔티티 조회 필요
            // const user = await this.userRepository.findById(userId);
            // return department.isReviewAuthority(user);
            return false;
        } catch (error) {
            this.logger.error('부서 검토 권한 확인 실패', error.stack);
            return false;
        }
    }
}
