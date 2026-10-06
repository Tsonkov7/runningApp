import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateRunLogDto {
  @IsUUID()
  @ApiProperty({ description: 'The id of the race goal' })
  raceGoalId: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'The id of the planned workout' })
  plannedWorkoutId?: string;

  @IsDateString()
  @ApiProperty({ description: 'The date of the run' })
  completedAt: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The distance of the run in kilometers' })
  distanceKm: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ description: 'The duration of the run in minutes' })
  durationMin: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  @ApiPropertyOptional({ description: 'The rpe of the run', example: 5 })
  rpe?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The notes of the run' })
  notes?: string;
}
