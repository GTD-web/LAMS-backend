import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsIn, IsNotEmpty } from 'class-validator';

export class ManageDepartmentAuthorityDto {
    @ApiProperty({
        description: '?¬ìš©??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '? íš¨??UUID ?•ì‹?´ì–´???©ë‹ˆ??' })
    @IsNotEmpty({ message: '?¬ìš©??ID???„ìˆ˜?…ë‹ˆ??' })
    readonly userId: string;

    @ApiProperty({
        description: 'ê¶Œí•œ ?¡ì…˜',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @IsIn(['add', 'delete'], { message: '?¡ì…˜?€ add ?ëŠ” delete?¬ì•¼ ?©ë‹ˆ??' })
    @IsNotEmpty({ message: '?¡ì…˜?€ ?„ìˆ˜?…ë‹ˆ??' })
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: 'ê¶Œí•œ ?€??,
        example: 'access',
        enum: ['access', 'review'],
    })
    @IsIn(['access', 'review'], { message: '?€?…ì? access ?ëŠ” review?¬ì•¼ ?©ë‹ˆ??' })
    @IsNotEmpty({ message: '?€?…ì? ?„ìˆ˜?…ë‹ˆ??' })
    readonly type: 'access' | 'review';
}
