import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByDateRange(userId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) {
      throw new BadRequestException('`from` must be before or equal to `to`');
    }

    return this.prisma.plannedWorkout.findMany({
      where: {
        scheduledDate: {
          gte: fromDate,
          lte: toDate,
        },
        trainingPlan: {
          raceGoal: {
            userId,
          },
        },
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const workout = await this.prisma.plannedWorkout.findUnique({
      where: { id },
      include: {
        trainingPlan: {
          include: {
            raceGoal: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.trainingPlan.raceGoal.userId !== userId) {
      throw new ForbiddenException('You do not own this workout');
    }

    return workout;
  }
}
