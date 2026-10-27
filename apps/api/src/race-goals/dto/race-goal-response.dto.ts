import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RaceGoalResponseDto {
  @ApiProperty({ example: 'ad0ba182-8eef-47e0-ac31-bc5664672e27' })
  id: string;

  @ApiProperty({ example: 'ad0ba182-8eef-47e0-ac31-bc5664672e27' })
  userId: string;

  @ApiProperty({ example: '2026-12-06' })
  raceDate: Date;

  @ApiPropertyOptional({ example: 14400 })
  targetFinishTimeSec?: number | null;

  @ApiProperty({ example: 30 })
  baselineWeeklyMileageKm: number;

  @ApiProperty({ example: 12 })
  baselineLongestRunKm: number;

  @ApiProperty({ example: 4 })
  daysPerWeek: number;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'COMPLETED', 'ARCHIVED'] })
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

  @ApiProperty({ example: '2026-10-12T10:00:00.000Z' })
  createdAt: Date;
}
