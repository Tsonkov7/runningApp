import { ApiProperty } from '@nestjs/swagger';

export class ThisWeekProgressDto {
  @ApiProperty({ example: 32.5 })
  plannedKm: number;

  @ApiProperty({ example: 20 })
  actualKm: number;

  @ApiProperty({ example: 2 })
  completedRuns: number;

  @ApiProperty({ example: 62 })
  adherencePercent: number;
}

export class ProgressSummaryResponseDto {
  @ApiProperty({ example: '2026-12-06' })
  raceDate: Date;

  @ApiProperty({ example: 45 })
  daysUntilRace: number;

  @ApiProperty({ type: ThisWeekProgressDto })
  thisWeek: ThisWeekProgressDto;
}
