import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EmployeeAnnualLeaveEntity, BirthDayLeaveStatus } from '../entities/employee-annual-leave.entity';

/**
 * Annual-Leave 도메인 서비스
 * - 연차 정보 관련 도메인 로직
 */
@Injectable()
export class AnnualLeaveDomainService {
    private readonly logger = new Logger(AnnualLeaveDomainService.name);

    constructor(
        @InjectRepository(EmployeeAnnualLeaveEntity)
        private readonly annualLeaveRepository: Repository<EmployeeAnnualLeaveEntity>,
    ) {}

    /**
     * 연차 정보를 ID로 조회한다
     */
    async findAnnualLeaveById(annualLeaveId: string): Promise<EmployeeAnnualLeaveEntity | null> {
        try {
            const annualLeave = await this.annualLeaveRepository.findOne({
                where: { annualLeaveId },
                relations: ['employee'],
            });

            if (annualLeave) {
                this.logger.log(`연차 정보 조회 완료: ${annualLeaveId}`);
            }

            return annualLeave;
        } catch (error) {
            this.logger.error(`연차 정보 조회 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 연도별 연차 정보를 조회한다
     */
    async findAnnualLeaveByEmployeeAndYear(
        employeeId: string,
        year: number,
    ): Promise<EmployeeAnnualLeaveEntity | null> {
        try {
            const annualLeave = await this.annualLeaveRepository.findOne({
                where: {
                    employee: { employeeId },
                    year,
                },
                relations: ['employee'],
            });

            if (annualLeave) {
                this.logger.log(`직원별 연도별 연차 정보 조회 완료: ${employeeId} (${year})`);
            }

            return annualLeave;
        } catch (error) {
            this.logger.error(`직원별 연도별 연차 정보 조회 실패: ${employeeId} (${year})`, error);
            throw error;
        }
    }

    /**
     * 직원별 연차 목록을 조회한다
     */
    async findAnnualLeavesByEmployee(employeeId: string): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const annualLeaves = await this.annualLeaveRepository.find({
                where: { employee: { employeeId } },
                relations: ['employee'],
                order: { year: 'DESC' },
            });

            this.logger.log(`직원별 연차 목록 조회 완료: ${employeeId} (${annualLeaves.length}개)`);

            return annualLeaves;
        } catch (error) {
            this.logger.error(`직원별 연차 목록 조회 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 연도별 모든 직원 연차 정보를 조회한다
     */
    async findAnnualLeavesByYear(year: number): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const annualLeaves = await this.annualLeaveRepository.find({
                where: { year },
                relations: ['employee'],
                order: { employee: { employeeNumber: 'ASC' } },
            });

            this.logger.log(`연도별 모든 직원 연차 조회 완료: ${year} (${annualLeaves.length}개)`);

            return annualLeaves;
        } catch (error) {
            this.logger.error(`연도별 모든 직원 연차 조회 실패: ${year}`, error);
            throw error;
        }
    }

    /**
     * 여러 직원의 연도별 연차 정보를 조회한다
     */
    async findAnnualLeavesByEmployeesAndYear(
        employeeIds: string[],
        year: number,
    ): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const annualLeaves = await this.annualLeaveRepository
                .createQueryBuilder('annualLeave')
                .leftJoinAndSelect('annualLeave.employee', 'employee')
                .where('employee.employeeId IN (:...employeeIds)', { employeeIds })
                .andWhere('annualLeave.year = :year', { year })
                .orderBy('employee.employeeNumber', 'ASC')
                .getMany();

            this.logger.log(`여러 직원 연도별 연차 조회 완료: ${year} (${annualLeaves.length}개)`);

            return annualLeaves;
        } catch (error) {
            this.logger.error(`여러 직원 연도별 연차 조회 실패: ${year}`, error);
            throw error;
        }
    }

    /**
     * 연차 정보를 생성한다
     */
    async createAnnualLeave(annualLeaveData: Partial<EmployeeAnnualLeaveEntity>): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const newAnnualLeave = this.annualLeaveRepository.create(annualLeaveData);
            const savedAnnualLeave = await this.annualLeaveRepository.save(newAnnualLeave);

            this.logger.log(`연차 정보 생성 완료: ${savedAnnualLeave.annualLeaveId}`);

            return savedAnnualLeave;
        } catch (error) {
            this.logger.error('연차 정보 생성 실패', error);
            throw error;
        }
    }

    /**
     * 여러 연차 정보를 일괄 생성한다
     */
    async createAnnualLeaves(
        annualLeavesData: Partial<EmployeeAnnualLeaveEntity>[],
    ): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const newAnnualLeaves = this.annualLeaveRepository.create(annualLeavesData);
            const savedAnnualLeaves = await this.annualLeaveRepository.save(newAnnualLeaves);

            this.logger.log(`연차 정보 일괄 생성 완료: ${savedAnnualLeaves.length}개`);

            return savedAnnualLeaves;
        } catch (error) {
            this.logger.error('연차 정보 일괄 생성 실패', error);
            throw error;
        }
    }

    /**
     * 연차 정보를 업데이트한다
     */
    async updateAnnualLeave(
        annualLeaveId: string,
        updateData: Partial<EmployeeAnnualLeaveEntity>,
    ): Promise<EmployeeAnnualLeaveEntity> {
        try {
            await this.annualLeaveRepository.update(annualLeaveId, updateData);
            const updatedAnnualLeave = await this.findAnnualLeaveById(annualLeaveId);

            if (!updatedAnnualLeave) {
                throw new Error(`업데이트된 연차 정보를 찾을 수 없습니다: ${annualLeaveId}`);
            }

            this.logger.log(`연차 정보 업데이트 완료: ${annualLeaveId}`);

            return updatedAnnualLeave;
        } catch (error) {
            this.logger.error(`연차 정보 업데이트 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 연차 정보를 삭제한다
     */
    async deleteAnnualLeave(annualLeaveId: string): Promise<boolean> {
        try {
            const result = await this.annualLeaveRepository.delete(annualLeaveId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`연차 정보 삭제 완료: ${annualLeaveId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`연차 정보 삭제 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 연차 정보를 엔티티 메서드로 업데이트한다
     */
    async updateAnnualLeaveWithData(
        annualLeaveId: string,
        updateDto: Partial<EmployeeAnnualLeaveEntity>,
    ): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const annualLeave = await this.findAnnualLeaveById(annualLeaveId);
            if (!annualLeave) {
                throw new Error(`연차 정보를 찾을 수 없습니다: ${annualLeaveId}`);
            }

            annualLeave.updateAnnualLeave(updateDto);
            const updatedAnnualLeave = await this.annualLeaveRepository.save(annualLeave);

            this.logger.log(`연차 정보 데이터 업데이트 완료: ${annualLeaveId}`);

            return updatedAnnualLeave;
        } catch (error) {
            this.logger.error(`연차 정보 데이터 업데이트 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 연차 정보를 생성하거나 업데이트한다
     */
    async createOrUpdateAnnualLeave(
        employeeId: string,
        year: number,
        annualLeaveData: Partial<EmployeeAnnualLeaveEntity>,
    ): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const existingAnnualLeave = await this.findAnnualLeaveByEmployeeAndYear(employeeId, year);

            if (existingAnnualLeave) {
                // 업데이트
                const updatedAnnualLeave = await this.updateAnnualLeave(
                    existingAnnualLeave.annualLeaveId,
                    annualLeaveData,
                );
                this.logger.log(`연차 정보 업데이트 완료: ${employeeId} (${year})`);
                return updatedAnnualLeave;
            } else {
                // 생성
                const createdAnnualLeave = await this.createAnnualLeave({
                    ...annualLeaveData,
                    employee: { employeeId } as any,
                    year,
                });
                this.logger.log(`연차 정보 생성 완료: ${employeeId} (${year})`);
                return createdAnnualLeave;
            }
        } catch (error) {
            this.logger.error(`연차 정보 생성/업데이트 실패: ${employeeId} (${year})`, error);
            throw error;
        }
    }

    /**
     * 사용 연차를 업데이트한다
     */
    async updateUsedAnnualLeave(annualLeaveId: string, usedAnnualLeave: number): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const annualLeave = await this.findAnnualLeaveById(annualLeaveId);
            if (!annualLeave) {
                throw new Error(`연차 정보를 찾을 수 없습니다: ${annualLeaveId}`);
            }

            // 잔여 연차 계산
            const remainedAnnualLeave = annualLeave.currentFiscalYearLeave - usedAnnualLeave;

            const updatedAnnualLeave = await this.updateAnnualLeave(annualLeaveId, {
                usedAnnualLeave,
                remainedAnnualLeave,
            });

            this.logger.log(
                `사용 연차 업데이트 완료: ${annualLeaveId} (사용: ${usedAnnualLeave}, 잔여: ${remainedAnnualLeave})`,
            );

            return updatedAnnualLeave;
        } catch (error) {
            this.logger.error(`사용 연차 업데이트 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 생일 휴가 상태를 업데이트한다
     */
    async updateBirthDayLeaveStatus(
        annualLeaveId: string,
        status: BirthDayLeaveStatus,
        details?: any[],
    ): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const updateData: Partial<EmployeeAnnualLeaveEntity> = {
                birthDayLeaveStatus: status,
            };

            if (details) {
                updateData.birthDayLeaveDetails = details;
            }

            const updatedAnnualLeave = await this.updateAnnualLeave(annualLeaveId, updateData);

            this.logger.log(`생일 휴가 상태 업데이트 완료: ${annualLeaveId} (${status})`);

            return updatedAnnualLeave;
        } catch (error) {
            this.logger.error(`생일 휴가 상태 업데이트 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 연차 조정 상태를 업데이트한다
     */
    async updateAdjustmentStatus(
        annualLeaveId: string,
        isAdjusted: boolean,
        note?: string,
    ): Promise<EmployeeAnnualLeaveEntity> {
        try {
            const updateData: Partial<EmployeeAnnualLeaveEntity> = { isAdjusted };
            if (note !== undefined) {
                updateData.note = note;
            }

            const updatedAnnualLeave = await this.updateAnnualLeave(annualLeaveId, updateData);

            this.logger.log(`연차 조정 상태 업데이트 완료: ${annualLeaveId} (조정: ${isAdjusted})`);

            return updatedAnnualLeave;
        } catch (error) {
            this.logger.error(`연차 조정 상태 업데이트 실패: ${annualLeaveId}`, error);
            throw error;
        }
    }

    /**
     * 연도별 연차 통계를 조회한다
     */
    async getAnnualLeaveStatsByYear(year: number): Promise<{
        totalEmployees: number;
        totalFiscalYearLeave: number;
        totalUsedLeave: number;
        totalRemainedLeave: number;
        averageUsedLeave: number;
        averageRemainedLeave: number;
        birthDayLeaveStats: Record<BirthDayLeaveStatus, number>;
        adjustedCount: number;
    }> {
        try {
            const annualLeaves = await this.findAnnualLeavesByYear(year);

            if (annualLeaves.length === 0) {
                return {
                    totalEmployees: 0,
                    totalFiscalYearLeave: 0,
                    totalUsedLeave: 0,
                    totalRemainedLeave: 0,
                    averageUsedLeave: 0,
                    averageRemainedLeave: 0,
                    birthDayLeaveStats: {
                        [BirthDayLeaveStatus.CAN_NOT_INPUT]: 0,
                        [BirthDayLeaveStatus.CAN_NOT_USED]: 0,
                        [BirthDayLeaveStatus.USED]: 0,
                    },
                    adjustedCount: 0,
                };
            }

            const totalFiscalYearLeave = annualLeaves.reduce((sum, al) => sum + al.currentFiscalYearLeave, 0);
            const totalUsedLeave = annualLeaves.reduce((sum, al) => sum + al.usedAnnualLeave, 0);
            const totalRemainedLeave = annualLeaves.reduce((sum, al) => sum + al.remainedAnnualLeave, 0);

            const birthDayLeaveStats = {
                [BirthDayLeaveStatus.CAN_NOT_INPUT]: 0,
                [BirthDayLeaveStatus.CAN_NOT_USED]: 0,
                [BirthDayLeaveStatus.USED]: 0,
            };

            let adjustedCount = 0;

            annualLeaves.forEach((al) => {
                birthDayLeaveStats[al.birthDayLeaveStatus]++;
                if (al.isAdjusted) adjustedCount++;
            });

            const stats = {
                totalEmployees: annualLeaves.length,
                totalFiscalYearLeave,
                totalUsedLeave,
                totalRemainedLeave,
                averageUsedLeave: Math.round((totalUsedLeave / annualLeaves.length) * 10) / 10,
                averageRemainedLeave: Math.round((totalRemainedLeave / annualLeaves.length) * 10) / 10,
                birthDayLeaveStats,
                adjustedCount,
            };

            this.logger.log(`연도별 연차 통계 조회 완료: ${year} (${stats.totalEmployees}명)`);

            return stats;
        } catch (error) {
            this.logger.error(`연도별 연차 통계 조회 실패: ${year}`, error);
            throw error;
        }
    }

    /**
     * 잔여 연차가 특정 값 이하인 직원을 조회한다
     */
    async findEmployeesWithLowRemainedLeave(year: number, threshold: number = 5): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const annualLeaves = await this.annualLeaveRepository
                .createQueryBuilder('annualLeave')
                .leftJoinAndSelect('annualLeave.employee', 'employee')
                .where('annualLeave.year = :year', { year })
                .andWhere('annualLeave.remainedAnnualLeave <= :threshold', { threshold })
                .orderBy('annualLeave.remainedAnnualLeave', 'ASC')
                .getMany();

            this.logger.log(`잔여 연차 부족 직원 조회 완료: ${year} (${threshold}일 이하) - ${annualLeaves.length}명`);

            return annualLeaves;
        } catch (error) {
            this.logger.error(`잔여 연차 부족 직원 조회 실패: ${year}`, error);
            throw error;
        }
    }

    /**
     * 조정이 필요한 연차 정보를 조회한다
     */
    async findAnnualLeavesNeedingAdjustment(year: number): Promise<EmployeeAnnualLeaveEntity[]> {
        try {
            const annualLeaves = await this.annualLeaveRepository
                .createQueryBuilder('annualLeave')
                .leftJoinAndSelect('annualLeave.employee', 'employee')
                .where('annualLeave.year = :year', { year })
                .andWhere('annualLeave.isAdjusted = :isAdjusted', { isAdjusted: false })
                .andWhere('(annualLeave.note IS NOT NULL AND annualLeave.note != "")')
                .orderBy('employee.employeeNumber', 'ASC')
                .getMany();

            this.logger.log(`조정 필요 연차 조회 완료: ${year} (${annualLeaves.length}개)`);

            return annualLeaves;
        } catch (error) {
            this.logger.error(`조정 필요 연차 조회 실패: ${year}`, error);
            throw error;
        }
    }

    /**
     * 연차 정보를 일괄 업데이트한다
     */
    async bulkUpdateAnnualLeaves(
        updates: Array<{
            annualLeaveId: string;
            updateData: Partial<EmployeeAnnualLeaveEntity>;
        }>,
    ): Promise<number> {
        try {
            let updatedCount = 0;

            for (const update of updates) {
                const result = await this.annualLeaveRepository.update(update.annualLeaveId, update.updateData);
                updatedCount += result.affected || 0;
            }

            this.logger.log(`연차 정보 일괄 업데이트 완료: ${updatedCount}개`);

            return updatedCount;
        } catch (error) {
            this.logger.error('연차 정보 일괄 업데이트 실패', error);
            throw error;
        }
    }
}
