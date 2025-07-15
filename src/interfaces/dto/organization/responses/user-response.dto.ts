import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';
import { ApprovalStepInfoEntity } from '@src/domain/approval/entities/approval-step-info.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 사용자 응답 DTO
 */
@Exclude()
export class UserResponseDto {
    @ApiProperty({
        description: '사용자 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    })
    @Expose()
    readonly userId: string;

    @ApiProperty({
        description: '사용자명',
        example: '삼각김밥',
    })
    @Expose()
    readonly username: string;

    @ApiProperty({
        description: '이메일 주소',
        example: 'sam.kim@lumir.space',
        format: 'email',
    })
    @Expose()
    readonly email: string;

    @ApiProperty({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: UserRole,
    })
    @Expose()
    readonly roles: UserRole[];

    @ApiProperty({
        description: '계정 활성화 상태',
        example: true,
    })
    @Expose()
    readonly isActive: boolean;

    @ApiProperty({
        description: '통합 계정 여부',
        example: true,
    })
    @Expose()
    readonly isIntegrated: boolean;

    @ApiProperty({
        description: '사용자 타입',
        example: 'LamsUserEntity',
    })
    @Expose()
    readonly type: string;

    @ApiProperty({
        description: '계정 생성일',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: '계정 수정일',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly updatedAt: Date;

    @ApiProperty({
        description: '권한 여부',
        example: true,
    })
    @Expose()
    readonly hasAccessAuthority: boolean;

    @ApiProperty({
        description: '권한 여부',
        example: true,
    })
    @Expose()
    readonly hasReviewAuthority: boolean;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
