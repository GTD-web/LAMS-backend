import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * 부??권한 관�??�답 DTO
 */
@Exclude()
export class DepartmentAuthorityResponse {
    @ApiProperty({
        description: '부??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId: string;

    @ApiProperty({
        description: '부?�명',
        example: '개발?�',
    })
    @Expose()
    readonly departmentName: string;

    @ApiProperty({
        description: '?�용??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly userId: string;

    @ApiProperty({
        description: '권한 ?�??,
        example: 'access',
        enum: ['access', 'review'],
    })
    @Expose()
    readonly authorityType: 'access' | 'review';

    @ApiProperty({
        description: '?�행???�업',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @Expose()
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: '?�업 ?�공 ?��?',
        example: true,
    })
    @Expose()
    readonly success: boolean;

    @ApiProperty({
        description: '메시지',
        example: '부???�근 권한???�공?�으�?추�??�었?�니??',
    })
    @Expose()
    readonly message: string;

    constructor(partial: Partial<DepartmentAuthorityResponse>) {
        Object.assign(this, partial);
    }
}
