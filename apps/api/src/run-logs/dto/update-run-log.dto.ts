import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRunLogDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '2026-10-20' })
  completedAt?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional({ example: 10.5 })
  distanceKm?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ example: 55 })
  durationMin?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  @ApiPropertyOptional({ example: 6 })
  rpe?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  notes?: string;
}
