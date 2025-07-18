import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * Î∂Ä???òÏ†ï ?îÏ≤≠ DTO
 */
export class UpdateDepartmentDto {
    @ApiPropertyOptional({
        description: 'Î∂Ä?úÎ™Ö',
        example: 'Í∞úÎ∞ú?Ä',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'ÏßÄ??Î∂Ä???¨Î?',
        example: false,
    })
    @IsBoolean()
    @IsOptional()
    isSupport?: boolean;

    @ApiPropertyOptional({
        description: '?ÅÏúÑ Î∂Ä??ID',
        example: 'dept-parent-123',
    })
    @IsString()
    @IsOptional()
    parentId?: string;
}
