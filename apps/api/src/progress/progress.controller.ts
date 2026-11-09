import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProgressSummaryResponseDto } from './dto/progress-summary-response.dto';
import { WeeklyProgressItemDto } from './dto/weekly-progress-item.dto';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};
@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}
  @ApiOperation({ summary: 'Get the summary of the progress' })
  @ApiOkResponse({ type: ProgressSummaryResponseDto })
  @Get('summary')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.progressService.getSummary(user.id);
  }
  @ApiOperation({ summary: 'Get the weekly progress' })
  @ApiQuery({ name: 'weeks', required: false, type: Number, example: 8 })
  @ApiOkResponse({ type: [WeeklyProgressItemDto] })
  @Get('weekly')
  getWeekly(@CurrentUser() user: AuthUser, @Query('weeks') weeks?: string) {
    const parsedWeeks = weeks ? Number(weeks) : 8;
    return this.progressService.getWeekly(user.id, parsedWeeks);
  }
}
