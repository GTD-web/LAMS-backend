import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { AttendanceTypeEntity } from '../entities/attendance-type.entity';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../../../common/dtos/pagination/pagination-response.dto';

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
        return await this.attendanceTypeRepository.findOne({
            where: { attendanceTypeId },
        });
    }

    /**
     * 근무 유형 ID로 조회 (예외처리)
     */
    async getAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeEntity> {
        const attendanceType = await this.attendanceTypeRepository.findOne({
            where: { attendanceTypeId },
        });

        if (!attendanceType) {
            throw new NotFoundException('해당 ID의 근무 유형을 찾을 수 없습니다.');
        }

        return attendanceType;
    }

    /**
     * 근무 유형 목록 조회 (페이지네이션)
     */
    async findPaginatedAttendanceTypes(
        paginationQuery: PaginationQueryDto,
        where?: FindOptionsWhere<AttendanceTypeEntity>,
        order?: FindOptionsOrder<AttendanceTypeEntity>,
    ): Promise<PaginatedResponseDto<AttendanceTypeEntity>> {
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        const [attendanceTypes, total] = await this.attendanceTypeRepository.findAndCount({
            where,
            order: order || { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        const meta = new PaginationMetaDto(page, limit, total);
        return new PaginatedResponseDto(attendanceTypes, meta);
    }

    /**
     * 근무 유형 생성
     */
    async createAttendanceType(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity> {
        // 제목 중복 검사
        if (attendanceTypeData.title) {
            const existingType = await this.attendanceTypeRepository.findOne({
                where: { title: attendanceTypeData.title },
            });

            if (existingType) {
                throw new ConflictException('이미 존재하는 근무 유형 제목입니다.');
            }
        }

        const newAttendanceType = this.attendanceTypeRepository.create(attendanceTypeData);
        return await this.attendanceTypeRepository.save(newAttendanceType);
    }

    /**
     * 근무 유형 업데이트
     */
    async updateAttendanceType(
        attendanceTypeId: string,
        updateData: Partial<AttendanceTypeEntity>,
    ): Promise<AttendanceTypeEntity> {
        // 존재하는 근무 유형인지 확인
        const existingType = await this.getAttendanceTypeById(attendanceTypeId);

        // 제목 중복 검사 (자신 제외)
        if (updateData.title && updateData.title !== existingType.title) {
            const duplicateType = await this.attendanceTypeRepository.findOne({
                where: { title: updateData.title },
            });

            if (duplicateType) {
                throw new ConflictException('이미 존재하는 근무 유형 제목입니다.');
            }
        }

        await this.attendanceTypeRepository.update(attendanceTypeId, updateData);
        return await this.getAttendanceTypeById(attendanceTypeId);
    }

    /**
     * 근무 유형 삭제
     */
    async deleteAttendanceType(attendanceTypeId: string): Promise<boolean> {
        // 존재하는 근무 유형인지 확인
        await this.getAttendanceTypeById(attendanceTypeId);

        const result = await this.attendanceTypeRepository.delete(attendanceTypeId);

        if (result.affected === 0) {
            throw new BadRequestException('근무 유형 삭제에 실패했습니다.');
        }

        return true;
    }

    /**
     * 근무 유형 저장
     */
    async saveAttendanceType(attendanceType: AttendanceTypeEntity): Promise<AttendanceTypeEntity> {
        return await this.attendanceTypeRepository.save(attendanceType);
    }

    /**
     * 모든 근무 유형 조회
     */
    async findAllAttendanceTypes(): Promise<AttendanceTypeEntity[]> {
        return await this.attendanceTypeRepository.find();
    }
}
