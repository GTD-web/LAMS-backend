import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { AttendanceTypeEntity } from '../entities/attendance-type.entity';

/**
 * 근무 유형 도메인 서비스
 */
@Injectable()
export class AttendanceTypeDomainService {
    private readonly logger = new Logger(AttendanceTypeDomainService.name);

    constructor(
        @InjectRepository(AttendanceTypeEntity)
        private readonly attendanceTypeRepository: Repository<AttendanceTypeEntity>,
    ) {}

    /**
     * 근무 유형 ID로 조회
     */
    async findAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeEntity | null> {
        try {
            return await this.attendanceTypeRepository.findOne({
                where: { attendanceTypeId },
            });
        } catch (error) {
            this.logger.error(`근무 유형 조회 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 근무 유형 목록 조회 (페이지네이션)
     */
    async findAttendanceTypes(
        page: number = 1,
        limit: number = 10,
        where?: FindOptionsWhere<AttendanceTypeEntity>,
        order?: FindOptionsOrder<AttendanceTypeEntity>,
    ): Promise<{ attendanceTypes: AttendanceTypeEntity[]; total: number }> {
        try {
            const skip = (page - 1) * limit;
            const take = limit;

            const [attendanceTypes, total] = await Promise.all([
                this.attendanceTypeRepository.find({ where, order, skip, take }),
                this.attendanceTypeRepository.count({ where }),
            ]);

            return { attendanceTypes, total };
        } catch (error) {
            this.logger.error('근무 유형 목록 조회 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 생성
     */
    async createAttendanceType(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity> {
        try {
            const newAttendanceType = this.attendanceTypeRepository.create(attendanceTypeData);
            return await this.attendanceTypeRepository.save(newAttendanceType);
        } catch (error) {
            this.logger.error('근무 유형 생성 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 업데이트
     */
    async updateAttendanceType(
        attendanceTypeId: string,
        updateData: Partial<AttendanceTypeEntity>,
    ): Promise<AttendanceTypeEntity> {
        try {
            await this.attendanceTypeRepository.update(attendanceTypeId, updateData);
            return await this.findAttendanceTypeById(attendanceTypeId);
        } catch (error) {
            this.logger.error(`근무 유형 업데이트 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 근무 유형 삭제
     */
    async deleteAttendanceType(attendanceTypeId: string): Promise<boolean> {
        try {
            const result = await this.attendanceTypeRepository.delete(attendanceTypeId);
            return result.affected > 0;
        } catch (error) {
            this.logger.error(`근무 유형 삭제 실패: ${attendanceTypeId}`, error);
            throw error;
        }
    }

    /**
     * 근무 유형 저장
     */
    async saveAttendanceType(attendanceType: AttendanceTypeEntity): Promise<AttendanceTypeEntity> {
        try {
            return await this.attendanceTypeRepository.save(attendanceType);
        } catch (error) {
            this.logger.error('근무 유형 저장 실패', error);
            throw error;
        }
    }

    /**
     * 모든 근무 유형 조회
     */
    async findAllAttendanceTypes(): Promise<AttendanceTypeEntity[]> {
        try {
            return await this.attendanceTypeRepository.find();
        } catch (error) {
            this.logger.error('모든 근무 유형 조회 실패', error);
            throw error;
        }
    }
}
