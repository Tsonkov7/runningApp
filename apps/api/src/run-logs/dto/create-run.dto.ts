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

export class CreateRunLogDto {
  @IsUUID()
  raceGoalId: string;

  @IsOptional()
  @IsUUID()
  plannedWorkoutId?: string;

  @IsDateString()
  completedAt: string;

  @IsNumber()
  @IsPositive()
  distanceKm: number;

  @IsInt()
  @IsPositive()
  durationMin: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
