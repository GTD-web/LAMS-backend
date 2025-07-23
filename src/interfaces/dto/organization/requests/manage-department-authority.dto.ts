import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * 부서 권한 관리 요청 DTO
 */
export class ManageDepartmentAuthorityDto {
    @ApiProperty({
        description: '부서ID (UUID)',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: '부서ID는 필수입니다.' })
    @IsUUID(4, { message: '부서ID는 UUID 형식이어야 합니다.' })
    readonly departmentId: string;
}
