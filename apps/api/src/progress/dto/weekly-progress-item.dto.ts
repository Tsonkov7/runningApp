import { ApiProperty } from '@nestjs/swagger';

export class WeeklyProgressItemDto {
  @ApiProperty({ example: '2026-09-01' })
  weekStart: string;

  @ApiProperty({ example: 30 })
  plannedKm: number;

  @ApiProperty({ example: 28 })
  actualKm: number;
}
