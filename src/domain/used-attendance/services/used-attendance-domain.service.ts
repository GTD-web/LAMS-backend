import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { UsedAttendanceEntity } from '../entities/used-attendance.entity';

/**
 * Used-Attendance 도메인 서비스
 * - 사용 근태 정보 관련 도메인 로직
 */
@Injectable()
export class UsedAttendanceDomainService {
    private readonly logger = new Logger(UsedAttendanceDomainService.name);

    constructor(
        @InjectRepository(UsedAttendanceEntity)
        private readonly usedAttendanceRepository: Repository<UsedAttendanceEntity>,
    ) {}

    /**
     * 사용 근태를 ID로 조회한다
     */
    async findUsedAttendanceById(usedAttendanceId: string): Promise<UsedAttendanceEntity | null> {
        try {
            const usedAttendance = await this.usedAttendanceRepository.findOne({
                where: { usedAttendanceId },
                relations: ['employee', 'attendanceType'],
            });

            if (usedAttendance) {
                this.logger.log(`사용 근태 조회 완료: ${usedAttendanceId}`);
            }

            return usedAttendance;
        } catch (error) {
            this.logger.error(`사용 근태 조회 실패: ${usedAttendanceId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 사용 근태 목록을 조회한다
     */
    async findUsedAttendancesByEmployee(
        employeeId: string,
        startDate?: string,
        endDate?: string,
    ): Promise<UsedAttendanceEntity[]> {
        try {
            const where: FindOptionsWhere<UsedAttendanceEntity> = {
                employee: { employeeId },
            };

            if (startDate && endDate) {
                where.usedAt = Between(startDate, endDate);
            }

            const usedAttendances = await this.usedAttendanceRepository.find({
                where,
                relations: ['employee', 'attendanceType'],
                order: { usedAt: 'DESC' },
            });

            this.logger.log(`직원별 사용 근태 조회 완료: ${employeeId} (${usedAttendances.length}개)`);

            return usedAttendances;
        } catch (error) {
            this.logger.error(`직원별 사용 근태 조회 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 날짜별 사용 근태 목록을 조회한다
     */
    async findUsedAttendancesByDate(date: string): Promise<UsedAttendanceEntity[]> {
        try {
            const usedAttendances = await this.usedAttendanceRepository.find({
                where: { usedAt: date },
                relations: ['employee', 'attendanceType'],
                order: { employee: { employeeNumber: 'ASC' } },
            });

            this.logger.log(`날짜별 사용 근태 조회 완료: ${date} (${usedAttendances.length}개)`);

            return usedAttendances;
        } catch (error) {
            this.logger.error(`날짜별 사용 근태 조회 실패: ${date}`, error);
            throw error;
        }
    }

    /**
     * 기간별 사용 근태 목록을 조회한다
     */
    async findUsedAttendancesByDateRange(
        startDate: string,
        endDate: string,
        employeeIds?: string[],
    ): Promise<UsedAttendanceEntity[]> {
        try {
            const queryBuilder = this.usedAttendanceRepository
                .createQueryBuilder('usedAttendance')
                .leftJoinAndSelect('usedAttendance.employee', 'employee')
                .leftJoinAndSelect('usedAttendance.attendanceType', 'attendanceType')
                .where('usedAttendance.usedAt BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });

            if (employeeIds && employeeIds.length > 0) {
                queryBuilder.andWhere('employee.employeeId IN (:...employeeIds)', {
                    employeeIds,
                });
            }

            const usedAttendances = await queryBuilder
                .orderBy('usedAttendance.usedAt', 'ASC')
                .addOrderBy('employee.employeeNumber', 'ASC')
                .getMany();

            this.logger.log(`기간별 사용 근태 조회 완료: ${startDate}~${endDate} (${usedAttendances.length}개)`);

            return usedAttendances;
        } catch (error) {
            this.logger.error(`기간별 사용 근태 조회 실패: ${startDate}~${endDate}`, error);
            throw error;
        }
    }

    /**
     * 근태 유형별 사용 근태 목록을 조회한다
     */
    async findUsedAttendancesByAttendanceType(
        attendanceTypeId: string,
        startDate?: string,
        endDate?: string,
    ): Promise<UsedAttendanceEntity[]> {
        try {
            const where: FindOptionsWhere<UsedAttendanceEntity> = {
                attendanceType: { attendanceTypeId },
            };

            if (startDate && endDate) {
                where.usedAt = Between(startDate, endDate);
            }

            const usedAttendances = await this.usedAttendanceRepository.find({
                where,
                relations: ['employee', 'attendanceType'],
                order: { usedAt: 'DESC', employee: { employeeNumber: 'ASC' } },
            });

            this.logger.log(`근태 유형별 사용 근태 조회 완료: ${attendanceTypeId} (${usedAttendances.length}개)`);

            return usedAttendances;
        } catch (error) {
            this.logger.error(`근태 유형별 사용 근태 조회 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 사용 근태를 생성한다
     */
    async createUsedAttendance(usedAttendanceData: Partial<UsedAttendanceEntity>): Promise<UsedAttendanceEntity> {
        try {
            const newUsedAttendance = this.usedAttendanceRepository.create(usedAttendanceData);
            const savedUsedAttendance = await this.usedAttendanceRepository.save(newUsedAttendance);

            this.logger.log(`사용 근태 생성 완료: ${savedUsedAttendance.usedAttendanceId}`);

            return savedUsedAttendance;
        } catch (error) {
            this.logger.error('사용 근태 생성 실패', error);
            throw error;
        }
    }

    /**
     * 여러 사용 근태를 일괄 생성한다
     */
    async createUsedAttendances(usedAttendancesData: Partial<UsedAttendanceEntity>[]): Promise<UsedAttendanceEntity[]> {
        try {
            const newUsedAttendances = this.usedAttendanceRepository.create(usedAttendancesData);
            const savedUsedAttendances = await this.usedAttendanceRepository.save(newUsedAttendances);

            this.logger.log(`사용 근태 일괄 생성 완료: ${savedUsedAttendances.length}개`);

            return savedUsedAttendances;
        } catch (error) {
            this.logger.error('사용 근태 일괄 생성 실패', error);
            throw error;
        }
    }

    /**
     * 사용 근태를 업데이트한다
     */
    async updateUsedAttendance(
        usedAttendanceId: string,
        updateData: Partial<UsedAttendanceEntity>,
    ): Promise<UsedAttendanceEntity> {
        try {
            await this.usedAttendanceRepository.update(usedAttendanceId, updateData);
            const updatedUsedAttendance = await this.findUsedAttendanceById(usedAttendanceId);

            if (!updatedUsedAttendance) {
                throw new Error(`업데이트된 사용 근태를 찾을 수 없습니다: ${usedAttendanceId}`);
            }

            this.logger.log(`사용 근태 업데이트 완료: ${usedAttendanceId}`);

            return updatedUsedAttendance;
        } catch (error) {
            this.logger.error(`사용 근태 업데이트 실패: ${usedAttendanceId}`, error);
            throw error;
        }
    }

    /**
     * 사용 근태를 삭제한다
     */
    async deleteUsedAttendance(usedAttendanceId: string): Promise<boolean> {
        try {
            const result = await this.usedAttendanceRepository.delete(usedAttendanceId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`사용 근태 삭제 완료: ${usedAttendanceId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`사용 근태 삭제 실패: ${usedAttendanceId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 기간 사용 근태를 삭제한다
     */
    async deleteUsedAttendancesByEmployeeAndDateRange(
        employeeId: string,
        startDate: string,
        endDate: string,
    ): Promise<number> {
        try {
            const result = await this.usedAttendanceRepository
                .createQueryBuilder()
                .delete()
                .where('employee.employeeId = :employeeId', { employeeId })
                .andWhere('usedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
                .execute();

            const deletedCount = result.affected || 0;
            this.logger.log(`직원별 기간 사용 근태 삭제 완료: ${employeeId} (${deletedCount}개)`);

            return deletedCount;
        } catch (error) {
            this.logger.error(`직원별 기간 사용 근태 삭제 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 사용 근태를 엔티티 메서드로 업데이트한다
     */
    async updateUsedAttendanceWithData(
        usedAttendanceId: string,
        updateDto: { usedAt: string; attendanceType: any },
    ): Promise<UsedAttendanceEntity> {
        try {
            const usedAttendance = await this.findUsedAttendanceById(usedAttendanceId);
            if (!usedAttendance) {
                throw new Error(`사용 근태를 찾을 수 없습니다: ${usedAttendanceId}`);
            }

            usedAttendance.updateUsedAttendance(updateDto);
            const updatedUsedAttendance = await this.usedAttendanceRepository.save(usedAttendance);

            this.logger.log(`사용 근태 데이터 업데이트 완료: ${usedAttendanceId}`);

            return updatedUsedAttendance;
        } catch (error) {
            this.logger.error(`사용 근태 데이터 업데이트 실패: ${usedAttendanceId}`, error);
            throw error;
        }
    }

    /**
     * 월별 사용 근태 통계를 조회한다
     */
    async getMonthlyUsedAttendanceStats(
        year: string,
        month: string,
        employeeIds?: string[],
    ): Promise<{
        totalUsedAttendances: number;
        attendanceTypeStats: Record<string, number>;
        employeeStats: Array<{
            employeeId: string;
            employeeNumber: string;
            employeeName: string;
            usedAttendanceCount: number;
            attendanceTypes: Record<string, number>;
        }>;
    }> {
        try {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = `${year}-${month.padStart(2, '0')}-31`;

            const usedAttendances = await this.findUsedAttendancesByDateRange(startDate, endDate, employeeIds);

            const attendanceTypeStats: Record<string, number> = {};
            const employeeStatsMap = new Map<
                string,
                {
                    employeeId: string;
                    employeeNumber: string;
                    employeeName: string;
                    usedAttendanceCount: number;
                    attendanceTypes: Record<string, number>;
                }
            >();

            usedAttendances.forEach((ua) => {
                // 근태 유형별 통계
                const typeName = ua.attendanceType.attendanceTypeName;
                attendanceTypeStats[typeName] = (attendanceTypeStats[typeName] || 0) + 1;

                // 직원별 통계
                const key = ua.employee.employeeId;
                if (!employeeStatsMap.has(key)) {
                    employeeStatsMap.set(key, {
                        employeeId: ua.employee.employeeId,
                        employeeNumber: ua.employee.employeeNumber,
                        employeeName: ua.employee.employeeName,
                        usedAttendanceCount: 0,
                        attendanceTypes: {},
                    });
                }

                const employeeStat = employeeStatsMap.get(key)!;
                employeeStat.usedAttendanceCount++;
                employeeStat.attendanceTypes[typeName] = (employeeStat.attendanceTypes[typeName] || 0) + 1;
            });

            const stats = {
                totalUsedAttendances: usedAttendances.length,
                attendanceTypeStats,
                employeeStats: Array.from(employeeStatsMap.values()),
            };

            this.logger.log(`월별 사용 근태 통계 조회 완료: ${year}-${month} (총 ${stats.totalUsedAttendances}개)`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 사용 근태 통계 조회 실패: ${year}-${month}`, error);
            throw error;
        }
    }

    /**
     * 직원의 특정 날짜 사용 근태를 조회한다
     */
    async findUsedAttendanceByEmployeeAndDate(employeeId: string, date: string): Promise<UsedAttendanceEntity[]> {
        try {
            const usedAttendances = await this.usedAttendanceRepository.find({
                where: {
                    employee: { employeeId },
                    usedAt: date,
                },
                relations: ['employee', 'attendanceType'],
                order: { createdAt: 'ASC' },
            });

            this.logger.log(`직원별 날짜별 사용 근태 조회 완료: ${employeeId} (${date}) - ${usedAttendances.length}개`);

            return usedAttendances;
        } catch (error) {
            this.logger.error(`직원별 날짜별 사용 근태 조회 실패: ${employeeId} (${date})`, error);
            throw error;
        }
    }

    /**
     * 사용 근태를 일괄 업데이트한다
     */
    async bulkUpdateUsedAttendances(
        updates: Array<{
            usedAttendanceId: string;
            updateData: Partial<UsedAttendanceEntity>;
        }>,
    ): Promise<number> {
        try {
            let updatedCount = 0;

            for (const update of updates) {
                const result = await this.usedAttendanceRepository.update(update.usedAttendanceId, update.updateData);
                updatedCount += result.affected || 0;
            }

            this.logger.log(`사용 근태 일괄 업데이트 완료: ${updatedCount}개`);

            return updatedCount;
        } catch (error) {
            this.logger.error('사용 근태 일괄 업데이트 실패', error);
            throw error;
        }
    }
}
