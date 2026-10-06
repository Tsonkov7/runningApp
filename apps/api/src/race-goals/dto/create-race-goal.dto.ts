import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRaceGoalDto {
  @IsDateString()
  @ApiProperty({ description: 'The date of the race', example: '2026-01-01' })
  raceDate: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({
    description: 'The target finish time in seconds',
    example: 10000,
  })
  targetFinishTimeSec?: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The baseline weekly mileage in kilometers',
    example: 100,
  })
  baselineWeeklyMileageKm: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The baseline longest run in kilometers',
    example: 20,
  })
  baselineLongestRunKm: number;

  @IsInt()
  @Min(3)
  @Max(5)
  @ApiProperty({ description: 'The number of days per week', example: 3 })
  daysPerWeek: number;
}
