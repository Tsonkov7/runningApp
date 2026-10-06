import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ListWorkoutsQueryDto } from './dto/list-workouts-query.dto';
import { WorkoutsService } from './workouts.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

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
  findByDateRange(
    @CurrentUser() user: AuthUser,
    @Query() query: ListWorkoutsQueryDto,
  ) {
    return this.workoutsService.findByDateRange(user.id, query.from, query.to);
  }

  @ApiOperation({ summary: 'Find a workout by id' })
  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.workoutsService.findOne(user.id, id);
  }
}
