import { ApiProperty } from '@nestjs/swagger';
import { PlannedWorkoutResponseDto } from './planned-workout-response.dto';

export class PlanMetadataDto {
  @ApiProperty({ example: 12 })
  totalWeeks: number;

  @ApiProperty({ example: 42 })
  peakWeeklyMileageKm: number;

  @ApiProperty({ example: 2 })
  taperWeeks: number;

  @ApiProperty({ example: 4 })
  daysPerWeek: number;
}

export class TrainingPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  raceGoalId: string;

  @ApiProperty({ example: '2026-09-20' })
  startDate: Date;

  @ApiProperty({ example: '2026-12-05' })
  endDate: Date;

  @ApiProperty({ type: PlanMetadataDto })
  planMetadata: PlanMetadataDto;

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty({ type: [PlannedWorkoutResponseDto] })
  workouts: PlannedWorkoutResponseDto[];
}
