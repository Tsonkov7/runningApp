import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TrainingPlansService } from './training-plans.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('training-plans')
@ApiBearerAuth()
@Controller()
@UseGuards(AuthGuard('jwt'))
export class TrainingPlansController {
  constructor(private readonly trainingPlansService: TrainingPlansService) {}

  @ApiOperation({ summary: 'Generate a training plan for a race goal' })
  @Post('race-goals/:raceGoalId/generate-plan')
  generate(
    @CurrentUser() user: AuthUser,
    @Param('raceGoalId') raceGoalId: string,
  ) {
    return this.trainingPlansService.generateForRaceGoal(user.id, raceGoalId);
  }

  @ApiOperation({ summary: 'Find a training plan by id' })
  @Get('training-plans/:id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.trainingPlansService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Find a training plan by race goal id' })
  @Get('race-goals/:raceGoalId/training-plan')
  findByRaceGoal(
    @CurrentUser() user: AuthUser,
    @Param('raceGoalId') raceGoalId: string,
  ) {
    return this.trainingPlansService.findByRaceGoal(user.id, raceGoalId);
  }
}
