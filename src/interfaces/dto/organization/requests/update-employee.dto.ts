import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * ÏßÅÏõê ?òÏ†ï ?îÏ≤≠ DTO
 */
export class UpdateEmployeeDto {
    @ApiPropertyOptional({
        description: 'ÏßÅÏõê ?¥Î¶Ñ',
        example: '?çÍ∏∏??,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: '?∞Í≤∞???¨Ïö©??ID',
        example: 'user123',
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({
        description: 'Î∂Ä??ID',
        example: 'dept-123',
    })
    @IsString()
    @IsOptional()
    departmentId?: string;
}
