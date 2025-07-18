import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * 직원 ?�정 ?�청 DTO
 */
export class UpdateEmployeeDto {
    @ApiPropertyOptional({
        description: '직원 ?�름',
        example: '?�길??,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: '?�결???�용??ID',
        example: 'user123',
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({
        description: '부??ID',
        example: 'dept-123',
    })
    @IsString()
    @IsOptional()
    departmentId?: string;
}
