import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * 직원 수정 요청 DTO
 */
export class UpdateEmployeeDto {
    @ApiPropertyOptional({
        description: '직원 이름',
        example: '홍길동',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: '연결된 사용자 ID',
        example: 'user123',
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({
        description: '부서 ID',
        example: 'dept-123',
    })
    @IsString()
    @IsOptional()
    departmentId?: string;
}
