import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { AttendanceTypeEntity } from '../entities/attendance-type.entity';

/**
 * 근무 유형 Context 서비스
 * - 비즈니스 로직에서 사용하는 Context 메서드들
 */
@Injectable()
export class AttendanceTypeContextService {
    private readonly logger = new Logger(AttendanceTypeContextService.name);

    constructor(
        @InjectRepository(AttendanceTypeEntity)
        private readonly attendanceTypeRepository: Repository<AttendanceTypeEntity>,
    ) {}

    /**
     * 페이지네이션된 근무 유형 목록 조회
     */
    async 페이지네이션된_근무_유형_목록_조회한다(
        limit: number,
        page: number,
    ): Promise<{
        attendanceTypes: AttendanceTypeEntity[];
        total: number;
        page: number;
        limit: number;
    }> {
        try {
            const skip = (page - 1) * limit;
            const take = limit;

            const [attendanceTypes, total] = await Promise.all([
                this.attendanceTypeRepository.find({
                    skip,
                    take,
                    order: { createdAt: 'DESC' },
                }),
                this.attendanceTypeRepository.count(),
            ]);

            this.logger.log(`근무 유형 목록 조회 완료: ${attendanceTypes.length}개 (페이지: ${page}, 제한: ${limit})`);

            return {
                attendanceTypes,
                total,
                page,
                limit,
            };
        } catch (error) {
            this.logger.error('근무 유형 목록 조회 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 ID로 조회
     */
    async 근무_유형_ID로_조회한다(attendanceTypeId: string): Promise<AttendanceTypeEntity | null> {
        try {
            const attendanceType = await this.attendanceTypeRepository.findOne({
                where: { attendanceTypeId },
            });

            if (attendanceType) {
                this.logger.log(`근무 유형 조회 완료: ${attendanceType.title} (ID: ${attendanceTypeId})`);
            } else {
                this.logger.warn(`근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
            }

            return attendanceType;
        } catch (error) {
            this.logger.error(`근무 유형 조회 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 근무 유형 생성
     */
    async 근무_유형을_생성한다(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity> {
        try {
            const newAttendanceType = this.attendanceTypeRepository.create(attendanceTypeData);
            const savedAttendanceType = await this.attendanceTypeRepository.save(newAttendanceType);

            this.logger.log(
                `근무 유형 생성 완료: ${savedAttendanceType.title} (ID: ${savedAttendanceType.attendanceTypeId})`,
            );

            return savedAttendanceType;
        } catch (error) {
            this.logger.error('근무 유형 생성 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 업데이트
     */
    async 근무_유형을_업데이트한다(
        attendanceTypeId: string,
        updateData: Partial<AttendanceTypeEntity>,
    ): Promise<AttendanceTypeEntity> {
        try {
            await this.attendanceTypeRepository.update(attendanceTypeId, updateData);
            const updatedAttendanceType = await this.근무_유형_ID로_조회한다(attendanceTypeId);

            if (updatedAttendanceType) {
                this.logger.log(`근무 유형 업데이트 완료: ${updatedAttendanceType.title} (ID: ${attendanceTypeId})`);
            }

            return updatedAttendanceType;
        } catch (error) {
            this.logger.error(`근무 유형 업데이트 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 근무 유형 삭제
     */
    async 근무_유형을_삭제한다(attendanceTypeId: string): Promise<boolean> {
        try {
            const result = await this.attendanceTypeRepository.delete(attendanceTypeId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`근무 유형 삭제 완료: ${attendanceTypeId}`);
            } else {
                this.logger.warn(`삭제할 근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`근무 유형 삭제 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 모든 근무 유형 조회
     */
    async 모든_근무_유형을_조회한다(): Promise<AttendanceTypeEntity[]> {
        try {
            const attendanceTypes = await this.attendanceTypeRepository.find({
                order: { createdAt: 'DESC' },
            });

            this.logger.log(`모든 근무 유형 조회 완료: ${attendanceTypes.length}개`);

            return attendanceTypes;
        } catch (error) {
            this.logger.error('모든 근무 유형 조회 실패', error);
            throw error;
        }
    }
}
