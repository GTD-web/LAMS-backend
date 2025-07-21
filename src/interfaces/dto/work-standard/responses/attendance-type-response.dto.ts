import { ApiProperty } from '@nestjs/swagger';
import { AttendanceTypeEntity } from '../../../../domain/attendance-type/entities/attendance-type.entity';

/**
 * 근무 유형 응답 DTO
 */
export class AttendanceTypeResponseDto {
    @ApiProperty({
        description: '근무 유형 ID',
        example: 'uuid-string',
        format: 'uuid',
    })
    readonly attendanceTypeId: string;

    @ApiProperty({
        description: '근무 유형 제목',
        example: '정규근무',
    })
    readonly title: string;

    @ApiProperty({
        description: '근무 시간 (분)',
        example: 480,
        type: 'integer',
    })
    readonly workTime: number;

    @ApiProperty({
        description: '인정 근무 시간 여부',
        example: true,
    })
    readonly isRecognizedWorkTime: boolean;

    @ApiProperty({
        description: '시작 근무 시간',
        example: '09:00',
        nullable: true,
    })
    readonly startWorkTime: string | null;

    @ApiProperty({
        description: '종료 근무 시간',
        example: '18:00',
        nullable: true,
    })
    readonly endWorkTime: string | null;

    @ApiProperty({
        description: '차감 연차',
        example: 0,
        type: 'number',
        format: 'float',
    })
    readonly deductedAnnualLeave: number;

    @ApiProperty({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    readonly updatedAt: Date;

    constructor(entity: AttendanceTypeEntity) {
        this.attendanceTypeId = entity.attendanceTypeId;
        this.title = entity.title;
        this.workTime = entity.workTime;
        this.isRecognizedWorkTime = entity.isRecognizedWorkTime;
        this.startWorkTime = entity.startWorkTime;
        this.endWorkTime = entity.endWorkTime;
        this.deductedAnnualLeave = entity.deductedAnnualLeave;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }

    static fromEntity(entity: AttendanceTypeEntity): AttendanceTypeResponseDto {
        return new AttendanceTypeResponseDto(entity);
    }

    static fromEntities(entities: AttendanceTypeEntity[]): AttendanceTypeResponseDto[] {
        return entities.map((entity) => AttendanceTypeResponseDto.fromEntity(entity));
    }
}
