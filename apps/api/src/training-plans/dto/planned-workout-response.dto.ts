import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlannedWorkoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  trainingPlanId: string;

  @ApiProperty({ example: '2026-10-20' })
  scheduledDate: Date;

  @ApiProperty({ example: 1 })
  weekNumber: number;

  @ApiProperty({
    enum: ['REST', 'EASY', 'LONG', 'TEMPO', 'INTERVAL', 'RACE_PACE'],
  })
  workoutType: 'REST' | 'EASY' | 'LONG' | 'TEMPO' | 'INTERVAL' | 'RACE_PACE';

  @ApiProperty({ example: 10.5 })
  plannedDistanceKm: number;

  @ApiPropertyOptional({ example: 60 })
  plannedDurationMin?: number | null;

  @ApiProperty({ example: 'Easy run' })
  title: string;

  @ApiPropertyOptional()
  description?: string | null;
}
