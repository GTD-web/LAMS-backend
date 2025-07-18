import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * 부서 권한 관리 응답 DTO
 */
@Exclude()
export class DepartmentAuthorityResponse {
    @ApiProperty({
        description: '부서 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId: string;

    @ApiProperty({
        description: '부서 이름',
        example: '개발',
    })
    @Expose()
    readonly departmentName: string;

    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly userId: string;

    @ApiProperty({
        description: '권한 유형',
        example: 'access',
        enum: ['access', 'review'],
    })
    @Expose()
    readonly authorityType: 'access' | 'review';

    @ApiProperty({
        description: '액션',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @Expose()
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: '성공 여부',
        example: true,
    })
    @Expose()
    readonly success: boolean;

    @ApiProperty({
        description: '메시지',
        example: '부서 권한이 성공적으로 추가되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(partial: Partial<DepartmentAuthorityResponse>) {
        Object.assign(this, partial);
    }
}
