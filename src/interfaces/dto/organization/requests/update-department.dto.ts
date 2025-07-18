import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * 부???�정 ?�청 DTO
 */
export class UpdateDepartmentDto {
    @ApiPropertyOptional({
        description: '부?�명',
        example: '개발?�',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: '지??부???��?',
        example: false,
    })
    @IsBoolean()
    @IsOptional()
    isSupport?: boolean;

    @ApiPropertyOptional({
        description: '?�위 부??ID',
        example: 'dept-parent-123',
    })
    @IsString()
    @IsOptional()
    parentId?: string;
}
