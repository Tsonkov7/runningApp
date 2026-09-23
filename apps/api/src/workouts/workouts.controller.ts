import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ListWorkoutsQueryDto } from './dto/list-workouts-query.dto';
import { WorkoutsService } from './workouts.service';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@Controller('workouts')
@UseGuards(AuthGuard('jwt'))
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findByDateRange(
    @CurrentUser() user: AuthUser,
    @Query() query: ListWorkoutsQueryDto,
  ) {
    return this.workoutsService.findByDateRange(user.id, query.from, query.to);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.workoutsService.findOne(user.id, id);
  }
}
