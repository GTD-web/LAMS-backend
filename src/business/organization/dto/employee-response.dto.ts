import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * 직원 응답 DTO
 */
@Exclude()
export class EmployeeResponseDto {
    @ApiProperty({
        description: '직원 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    })
    @Expose()
    readonly employeeId: string;

    @ApiProperty({
        description: '직원 이름',
        example: '홍길동',
    })
    @Expose()
    readonly employeeName: string;

    @ApiProperty({
        description: '이메일 주소',
        example: 'hong@example.com',
        format: 'email',
    })
    @Expose()
    readonly email: string;

    @ApiProperty({
        description: '전화번호',
        example: '010-1234-5678',
        required: false,
    })
    @Expose()
    readonly phoneNumber?: string;

    @ApiProperty({
        description: '입사일',
        example: '2024-01-15',
        format: 'date',
        required: false,
    })
    @Expose()
    @Type(() => Date)
    readonly hireDate?: Date;

    @ApiProperty({
        description: '퇴사일',
        example: '2024-12-31',
        format: 'date',
        required: false,
    })
    @Expose()
    @Type(() => Date)
    readonly terminationDate?: Date;

    @ApiProperty({
        description: '재직 상태',
        example: '재직중',
    })
    @Expose()
    readonly status: string;

    @ApiProperty({
        description: 'MMS 직원 ID',
        example: '67d116b591e5366c327915d2',
        required: false,
    })
    @Expose()
    readonly mmsEmployeeId?: string;

    @ApiProperty({
        description: '직원 생성 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: '직원 정보 업데이트 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly updatedAt: Date;

    constructor(partial: Partial<EmployeeResponseDto>) {
        Object.assign(this, partial);
    }
}
