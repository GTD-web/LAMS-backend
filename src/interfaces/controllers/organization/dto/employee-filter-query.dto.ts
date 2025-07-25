import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../../common/dtos/pagination/pagination-query.dto';

/**
 * 직원 필터링 쿼리 DTO
 */
export class EmployeeFilterQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: '퇴사자 제외 여부',
        example: 'active',
        default: 'active',
    })
    @IsOptional()
    @IsString()
    @Type(() => String)
    status: 'active' | 'resigned' | 'all' = 'active';

    @ApiPropertyOptional({
        description: '계산에서 제외된 직원 제외 여부',
        example: true,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    excludeFromCalculation?: boolean = false;
}
