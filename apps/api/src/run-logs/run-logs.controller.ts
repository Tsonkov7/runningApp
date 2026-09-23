import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateRunLogDto } from './dto/create-run.dto';
import { RunLogsService } from './run-logs.service';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@Controller('run-logs')
@UseGuards(AuthGuard('jwt'))
export class RunLogsController {
  constructor(private readonly runLogsService: RunLogsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRunLogDto) {
    return this.runLogsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.runLogsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.runLogsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body()
    dto: {
      completedAt?: string;
      distanceKm?: number;
      durationMin?: number;
      rpe?: number;
      notes?: string;
    },
  ) {
    return this.runLogsService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.runLogsService.remove(user.id, id);
  }
}
