import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TrainingPlansService } from './training-plans.service';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@Controller()
@UseGuards(AuthGuard('jwt'))
export class TrainingPlansController {
  constructor(private readonly trainingPlansService: TrainingPlansService) {}

  @Post('race-goals/:raceGoalId/generate-plan')
  generate(
    @CurrentUser() user: AuthUser,
    @Param('raceGoalId') raceGoalId: string,
  ) {
    return this.trainingPlansService.generateForRaceGoal(user.id, raceGoalId);
  }

  @Get('training-plans/:id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.trainingPlansService.findOne(user.id, id);
  }

  @Get('race-goals/:raceGoalId/training-plan')
  findByRaceGoal(
    @CurrentUser() user: AuthUser,
    @Param('raceGoalId') raceGoalId: string,
  ) {
    return this.trainingPlansService.findByRaceGoal(user.id, raceGoalId);
  }
}
