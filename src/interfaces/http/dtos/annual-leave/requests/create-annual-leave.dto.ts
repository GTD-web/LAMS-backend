import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAnnualLeaveDto {
  @ApiProperty({
    description: 'Employee ID',
    example: 'EMP001',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Employee ID must be a string' })
  @IsNotEmpty({ message: 'Employee ID is required' })
  @Transform(({ value }) => value?.trim())
  readonly employeeId: string;

  @ApiProperty({
    description: 'Year for annual leave',
    example: 2024,
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(2000, { message: 'Year must be at least 2000' })
  @Max(2100, { message: 'Year must be at most 2100' })
  readonly year: number;

  @ApiProperty({
    description: 'Total annual leave days',
    example: 15,
    minimum: 0,
    maximum: 365,
  })
  @IsNumber({}, { message: 'Total days must be a number' })
  @Min(0, { message: 'Total days must be at least 0' })
  @Max(365, { message: 'Total days must be at most 365' })
  readonly totalDays: number;

  @ApiProperty({
    description: 'Used annual leave days',
    example: 5,
    minimum: 0,
    maximum: 365,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Used days must be a number' })
  @Min(0, { message: 'Used days must be at least 0' })
  @Max(365, { message: 'Used days must be at most 365' })
  readonly usedDays?: number = 0;

  @ApiProperty({
    description: 'Remaining annual leave days',
    example: 10,
    minimum: 0,
    maximum: 365,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Remaining days must be a number' })
  @Min(0, { message: 'Remaining days must be at least 0' })
  @Max(365, { message: 'Remaining days must be at most 365' })
  readonly remainingDays?: number;

  @ApiProperty({
    description: 'Entry date for the employee',
    example: '2023-01-01',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Entry date must be a valid date string' })
  readonly entryDate?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Generated automatically based on entry date',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Transform(({ value }) => value?.trim())
  readonly notes?: string;
}
