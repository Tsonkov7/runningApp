import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateRaceGoalDto {
  @IsDateString()
  raceDate: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  targetFinishTimeSec?: number;

  @IsNumber()
  @IsPositive()
  baselineWeeklyMileageKm: number;

  @IsNumber()
  @IsPositive()
  baselineLongestRunKm: number;

  @IsInt()
  @Min(3)
  @Max(5)
  daysPerWeek: number;
}
