import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * 부??권한 관�??�청 DTO
 */
export class ManageDepartmentAuthorityDto {
    @ApiProperty({
        description: '사용자ID (UUID)',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: '사용자ID는 필수입니다.' })
    @IsUUID(4, { message: '사용자ID는 UUID 형식이어야 합니다.' })
    readonly userId: string;
}
