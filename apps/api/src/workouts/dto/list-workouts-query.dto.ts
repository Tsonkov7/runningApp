import { IsDateString } from 'class-validator';

export class ListWorkoutsQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
