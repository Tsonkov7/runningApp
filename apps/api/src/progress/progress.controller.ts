import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import { ApiTags } from '@nestjs/swagger';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('Progress')
@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.progressService.getSummary(user.id);
  }

  @Get('weekly')
  getWeekly(@CurrentUser() user: AuthUser, @Query('weeks') weeks?: string) {
    const parsedWeeks = weeks ? Number(weeks) : 8;
    return this.progressService.getWeekly(user.id, parsedWeeks);
  }
}
