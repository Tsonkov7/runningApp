import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanGeneratorService } from './plan-generator.service';

@Injectable()
export class TrainingPlansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planGenerator: PlanGeneratorService,
  ) {}

  async generateForRaceGoal(userId: string, raceGoalId: string) {
    const raceGoal = await this.prisma.raceGoal.findUnique({
      where: { id: raceGoalId },
      include: { trainingPlan: true },
    });

    if (!raceGoal) {
      throw new NotFoundException('Race goal not found');
    }

    if (raceGoal.userId !== userId) {
      throw new ForbiddenException('You do not own this race goal');
    }

    if (raceGoal.trainingPlan) {
      throw new ConflictException(
        'A training plan already exists for this goal',
      );
    }

    const generated = this.planGenerator.generate({
      raceDate: raceGoal.raceDate,
      baselineWeeklyMileageKm: raceGoal.baselineWeeklyMileageKm,
      baselineLongestRunKm: raceGoal.baselineLongestRunKm,
      daysPerWeek: raceGoal.daysPerWeek,
    });

    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.trainingPlan.create({
        data: {
          raceGoalId: raceGoal.id,
          startDate: generated.startDate,
          endDate: generated.endDate,
          planMetadata: generated.planMetadata,
          workouts: {
            create: generated.workouts.map((workout) => ({
              scheduledDate: workout.scheduledDate,
              weekNumber: workout.weekNumber,
              workoutType: workout.workoutType,
              plannedDistanceKm: workout.plannedDistanceKm,
              title: workout.title,
              description: workout.description,
            })),
          },
        },
        include: {
          workouts: {
            orderBy: { scheduledDate: 'asc' },
          },
        },
      });

      return plan;
    });
  }

  async findOne(userId: string, planId: string) {
    const plan = await this.prisma.trainingPlan.findUnique({
      where: { id: planId },
      include: {
        raceGoal: true,
        workouts: {
          orderBy: { scheduledDate: 'asc' },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Training plan not found');
    }

    if (plan.raceGoal.userId !== userId) {
      throw new ForbiddenException('You do not own this training plan');
    }

    return plan;
  }

  async findByRaceGoal(userId: string, raceGoalId: string) {
    const raceGoal = await this.prisma.raceGoal.findUnique({
      where: { id: raceGoalId },
      include: {
        trainingPlan: {
          include: {
            workouts: {
              orderBy: { scheduledDate: 'asc' },
            },
          },
        },
      },
    });

    if (!raceGoal) {
      throw new NotFoundException('Race goal not found');
    }

    if (raceGoal.userId !== userId) {
      throw new ForbiddenException('You do not own this race goal');
    }

    if (!raceGoal.trainingPlan) {
      throw new NotFoundException('No training plan for this race goal');
    }

    return raceGoal.trainingPlan;
  }
}
