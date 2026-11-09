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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RunLogResponseDto } from './dto/run-log-response.dto';
import { UpdateRunLogDto } from './dto/update-run-log.dto';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

@ApiTags('run-logs')
@ApiBearerAuth()
@Controller('run-logs')
@UseGuards(AuthGuard('jwt'))
export class RunLogsController {
  constructor(private readonly runLogsService: RunLogsService) {}

  @ApiOperation({ summary: 'Create a new run log' })
  @Post()
  @ApiCreatedResponse({ type: RunLogResponseDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRunLogDto) {
    return this.runLogsService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Find all run logs' })
  @ApiOkResponse({ type: [RunLogResponseDto] })
  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.runLogsService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Find a run log by id' })
  @ApiOkResponse({ type: RunLogResponseDto })
  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.runLogsService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Update a run log by id' })
  @ApiOkResponse({ type: RunLogResponseDto })
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body()
    dto: UpdateRunLogDto,
  ) {
    return this.runLogsService.update(user.id, id, dto);
  }

  @ApiOperation({ summary: 'Delete a run log by id' })
  @ApiOkResponse({ type: RunLogResponseDto })
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.runLogsService.remove(user.id, id);
  }
}
