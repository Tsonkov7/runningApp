import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRunLogDto } from './dto/create-run.dto';

@Injectable()
export class RunLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRunLogDto) {
    const completedAt = new Date(dto.completedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (completedAt > today) {
      throw new BadRequestException('completedAt cannot be in the future');
    }

    const raceGoal = await this.prisma.raceGoal.findUnique({
      where: { id: dto.raceGoalId },
    });

    if (!raceGoal) {
      throw new NotFoundException('Race goal not found');
    }

    if (raceGoal.userId !== userId) {
      throw new ForbiddenException('You do not own this race goal');
    }

    if (dto.plannedWorkoutId) {
      const workout = await this.prisma.plannedWorkout.findUnique({
        where: { id: dto.plannedWorkoutId },
        include: {
          trainingPlan: {
            include: { raceGoal: true },
          },
        },
      });

      if (!workout) {
        throw new NotFoundException('Planned workout not found');
      }

      if (workout.trainingPlan.raceGoal.userId !== userId) {
        throw new ForbiddenException('You do not own this planned workout');
      }
    }

    return this.prisma.runLog.create({
      data: {
        userId,
        raceGoalId: dto.raceGoalId,
        plannedWorkoutId: dto.plannedWorkoutId,
        completedAt,
        distanceKm: dto.distanceKm,
        durationMin: dto.durationMin,
        rpe: dto.rpe,
        notes: dto.notes,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.runLog.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const runLog = await this.prisma.runLog.findUnique({
      where: { id },
    });

    if (!runLog) {
      throw new NotFoundException('Run log not found');
    }

    if (runLog.userId !== userId) {
      throw new ForbiddenException('You do not own this run log');
    }

    return runLog;
  }

  async update(
    userId: string,
    id: string,
    dto: {
      completedAt?: string;
      distanceKm?: number;
      durationMin?: number;
      rpe?: number;
      notes?: string;
    },
  ) {
    await this.findOne(userId, id);

    if (dto.completedAt) {
      const completedAt = new Date(dto.completedAt);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (completedAt > today) {
        throw new BadRequestException('completedAt cannot be in the future');
      }
    }

    return this.prisma.runLog.update({
      where: { id },
      data: {
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
        distanceKm: dto.distanceKm,
        durationMin: dto.durationMin,
        rpe: dto.rpe,
        notes: dto.notes,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.runLog.delete({
      where: { id },
    });
  }
}
