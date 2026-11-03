import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ListWorkoutsQueryDto } from './dto/list-workouts-query.dto';
import { WorkoutsService } from './workouts.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PlannedWorkoutResponseDto } from '../training-plans/dto/planned-workout-response.dto';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
@UseGuards(AuthGuard('jwt'))
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @ApiOperation({ summary: 'Find workouts by date range' })
  @Get()
  @ApiOkResponse({ type: PlannedWorkoutResponseDto, isArray: true })
  findByDateRange(
    @CurrentUser() user: AuthUser,
    @Query() query: ListWorkoutsQueryDto,
  ) {
    return this.workoutsService.findByDateRange(user.id, query.from, query.to);
  }

  @ApiOperation({ summary: 'Find a workout by id' })
  @ApiOkResponse({ type: PlannedWorkoutResponseDto })
  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.workoutsService.findOne(user.id, id);
  }
}
