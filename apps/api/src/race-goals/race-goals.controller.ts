import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateRaceGoalDto } from './dto/create-race-goal.dto';
import { RaceGoalsService } from './race-goals.service';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@Controller('race-goals')
@UseGuards(AuthGuard('jwt'))
export class RaceGoalsController {
  constructor(private readonly raceGoalsService: RaceGoalsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRaceGoalDto) {
    return this.raceGoalsService.create(user.id, dto);
  }

  @Get('active')
  findActive(@CurrentUser() user: AuthUser) {
    return this.raceGoalsService.findActive(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.raceGoalsService.findOne(user.id, id);
  }
}
