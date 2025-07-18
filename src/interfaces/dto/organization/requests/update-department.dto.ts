import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * 부서 수정 요청 DTO
 */
export class UpdateDepartmentDto {
    @ApiPropertyOptional({
        description: '부서 이름',
        example: '개발',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: '지원 부서 여부',
        example: false,
    })
    @IsBoolean()
    @IsOptional()
    isSupport?: boolean;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'dept-parent-123',
    })
    @IsString()
    @IsOptional()
    parentId?: string;
}
