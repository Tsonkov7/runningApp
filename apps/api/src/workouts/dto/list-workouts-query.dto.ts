import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ListWorkoutsQueryDto {
  @IsDateString()
  @ApiProperty({ description: 'The start date of the workouts' })
  from: string;

  @IsDateString()
  @ApiProperty({ description: 'The end date of the workouts' })
  to: string;
}
