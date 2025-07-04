import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AnnualLeaveResponseDto {
  @ApiProperty({
    description: 'Unique annual leave identifier',
    example: 'uuid-v4-string',
    format: 'uuid',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: 'Employee ID',
    example: 'EMP001',
  })
  @Expose()
  readonly employeeId: string;

  @ApiProperty({
    description: 'Year for annual leave',
    example: 2024,
  })
  @Expose()
  readonly year: number;

  @ApiProperty({
    description: 'Total annual leave days',
    example: 15,
  })
  @Expose()
  readonly totalDays: number;

  @ApiProperty({
    description: 'Used annual leave days',
    example: 5,
  })
  @Expose()
  readonly usedDays: number;

  @ApiProperty({
    description: 'Remaining annual leave days',
    example: 10,
  })
  @Expose()
  readonly remainingDays: number;

  @ApiPropertyOptional({
    description: 'Entry date for the employee',
    example: '2023-01-01T00:00:00Z',
    format: 'date-time',
  })
  @Expose()
  readonly entryDate?: Date;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Generated automatically based on entry date',
  })
  @Expose()
  readonly notes?: string;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2023-12-01T10:00:00Z',
    format: 'date-time',
  })
  @Expose()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2023-12-01T10:00:00Z',
    format: 'date-time',
  })
  @Expose()
  readonly updatedAt: Date;

  constructor(partial: Partial<AnnualLeaveResponseDto>) {
    Object.assign(this, partial);
  }
}
