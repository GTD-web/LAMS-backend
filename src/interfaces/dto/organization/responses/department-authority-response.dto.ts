import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * ë¶€??ê¶Œí•œ ê´€ë¦??‘ë‹µ DTO
 */
@Exclude()
export class DepartmentAuthorityResponse {
    @ApiProperty({
        description: 'ë¶€??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId: string;

    @ApiProperty({
        description: 'ë¶€?œëª…',
        example: 'ê°œë°œ?€',
    })
    @Expose()
    readonly departmentName: string;

    @ApiProperty({
        description: '?¬ìš©??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly userId: string;

    @ApiProperty({
        description: 'ê¶Œí•œ ?€??,
        example: 'access',
        enum: ['access', 'review'],
    })
    @Expose()
    readonly authorityType: 'access' | 'review';

    @ApiProperty({
        description: '?˜í–‰???‘ì—…',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @Expose()
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: '?‘ì—… ?±ê³µ ?¬ë?',
        example: true,
    })
    @Expose()
    readonly success: boolean;

    @ApiProperty({
        description: 'ë©”ì‹œì§€',
        example: 'ë¶€???‘ê·¼ ê¶Œí•œ???±ê³µ?ìœ¼ë¡?ì¶”ê??˜ì—ˆ?µë‹ˆ??',
    })
    @Expose()
    readonly message: string;

    constructor(partial: Partial<DepartmentAuthorityResponse>) {
        Object.assign(this, partial);
    }
}
