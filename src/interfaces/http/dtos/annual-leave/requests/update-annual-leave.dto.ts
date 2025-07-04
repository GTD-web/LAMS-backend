import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAnnualLeaveDto {
  @ApiPropertyOptional({
    description: 'Total annual leave days',
    example: 15,
    minimum: 0,
    maximum: 365,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Total days must be a number' })
  @Min(0, { message: 'Total days must be at least 0' })
  @Max(365, { message: 'Total days must be at most 365' })
  readonly totalDays?: number;

  @ApiPropertyOptional({
    description: 'Used annual leave days',
    example: 5,
    minimum: 0,
    maximum: 365,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Used days must be a number' })
  @Min(0, { message: 'Used days must be at least 0' })
  @Max(365, { message: 'Used days must be at most 365' })
  readonly usedDays?: number;

  @ApiPropertyOptional({
    description: 'Remaining annual leave days',
    example: 10,
    minimum: 0,
    maximum: 365,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Remaining days must be a number' })
  @Min(0, { message: 'Remaining days must be at least 0' })
  @Max(365, { message: 'Remaining days must be at most 365' })
  readonly remainingDays?: number;

  @ApiPropertyOptional({
    description: 'Entry date for the employee',
    example: '2023-01-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Entry date must be a valid date string' })
  readonly entryDate?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Updated based on new calculations',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly notes?: string;
}
