import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaceGoalDto } from './dto/create-race-goal.dto';

@Injectable()
export class RaceGoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRaceGoalDto) {
    const raceDate = new Date(dto.raceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (raceDate <= today) {
      throw new BadRequestException('Race date must be in the future');
    }

    const existingActive = await this.prisma.raceGoal.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    if (existingActive) {
      throw new ConflictException('You already have an active race goal');
    }

    return this.prisma.raceGoal.create({
      data: {
        userId,
        raceDate,
        targetFinishTimeSec: dto.targetFinishTimeSec,
        baselineWeeklyMileageKm: dto.baselineWeeklyMileageKm,
        baselineLongestRunKm: dto.baselineLongestRunKm,
        daysPerWeek: dto.daysPerWeek,
        status: 'ACTIVE',
      },
    });
  }

  async findActive(userId: string) {
    const goal = await this.prisma.raceGoal.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    if (!goal) {
      throw new NotFoundException('No active race goal found');
    }

    return goal;
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.raceGoal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException('Race goal not found');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('You do not own this race goal');
    }

    return goal;
  }
}
