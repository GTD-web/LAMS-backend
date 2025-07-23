import { ApiProperty } from '@nestjs/swagger';
import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
import { IsUUID, IsIn, IsNotEmpty } from 'class-validator';

export class ManageDepartmentAuthorityDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID(4, { message: '유효한 UUID 형식이어야 합니다' })
    @IsNotEmpty({ message: '사용자 ID는 필수입니다' })
    readonly userId: string;

    @ApiProperty({
        description: '권한 액션',
        example: 'add',
        enum: ['add', 'delete'],
    })
    @IsIn(['add', 'delete'], { message: '액션은 add 또는 delete여야 합니다' })
    @IsNotEmpty({ message: '액션은 필수입니다' })
    readonly action: 'add' | 'delete';

    @ApiProperty({
        description: '권한 타입',
        example: 'access',
        enum: ['access', 'review'],
    })
    @IsIn(['access', 'review'], { message: '타입은 access 또는 review여야 합니다' })
    @IsNotEmpty({ message: '타입은 필수입니다' })
    readonly type: AuthorityType;
}
