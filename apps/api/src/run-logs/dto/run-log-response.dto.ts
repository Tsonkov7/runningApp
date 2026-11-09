import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RunLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  raceGoalId: string;

  @ApiPropertyOptional()
  plannedWorkoutId?: string | null;

  @ApiProperty({ example: '2026-10-20' })
  completedAt: Date;

  @ApiProperty({ example: 10.5 })
  distanceKm: number;

  @ApiProperty({ example: 55 })
  durationMin: number;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 6 })
  rpe?: number | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Felt good' })
  notes?: string | null;

  @ApiProperty()
  createdAt: Date;
}
