import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateRaceGoalDto } from './dto/create-race-goal.dto';
import { RaceGoalsService } from './race-goals.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RaceGoalResponseDto } from './dto/race-goal-response.dto';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('race-goals')
@ApiBearerAuth()
@Controller('race-goals')
@UseGuards(AuthGuard('jwt'))
export class RaceGoalsController {
  constructor(private readonly raceGoalsService: RaceGoalsService) {}

  @ApiOperation({ summary: 'Create a new race goal' })
  @ApiCreatedResponse({ type: RaceGoalResponseDto })
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRaceGoalDto) {
    return this.raceGoalsService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Find the active race goal' })
  @ApiOkResponse({ type: RaceGoalResponseDto })
  @Get('active')
  findActive(@CurrentUser() user: AuthUser) {
    return this.raceGoalsService.findActive(user.id);
  }

  @ApiOperation({ summary: 'Find a race goal by id' })
  @ApiOkResponse({ type: RaceGoalResponseDto })
  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.raceGoalsService.findOne(user.id, id);
  }
}
