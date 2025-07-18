import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsIn, IsNotEmpty } from 'class-validator';

export class ManageDepartmentAuthorityDto {
    @ApiProperty({
        description: '?�용??ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '?�효??UUID ?�식?�어???�니??' })
    @IsNotEmpty({ message: '?�용??ID???�수?�니??' })
    readonly userId: string;

    @ApiProperty({
        description: '권한 ?�션',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @IsIn(['add', 'delete'], { message: '?�션?� add ?�는 delete?�야 ?�니??' })
    @IsNotEmpty({ message: '?�션?� ?�수?�니??' })
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: '권한 ?�??,
        example: 'access',
        enum: ['access', 'review'],
    })
    @IsIn(['access', 'review'], { message: '?�?��? access ?�는 review?�야 ?�니??' })
    @IsNotEmpty({ message: '?�?��? ?�수?�니??' })
    readonly type: 'access' | 'review';
}
