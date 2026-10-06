import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('progress')
@Controller('progress')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @ApiOperation({ summary: 'Get the summary of the progress' })
  @Get('summary')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.progressService.getSummary(user.id);
  }

  @ApiOperation({ summary: 'Get the weekly progress' })
  @Get('weekly')
  getWeekly(@CurrentUser() user: AuthUser, @Query('weeks') weeks?: string) {
    const parsedWeeks = weeks ? Number(weeks) : 8;
    return this.progressService.getWeekly(user.id, parsedWeeks);
  }
}
