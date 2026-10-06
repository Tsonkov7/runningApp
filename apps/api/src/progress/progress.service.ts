import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const raceGoal = await this.prisma.raceGoal.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!raceGoal) {
      throw new NotFoundException('No active race goal found');
    }

    const { weekStart, weekEnd } = this.getCurrentWeekRange();

    const [plannedWorkouts, runLogs] = await Promise.all([
      this.prisma.plannedWorkout.findMany({
        where: {
          scheduledDate: { gte: weekStart, lte: weekEnd },
          trainingPlan: { raceGoalId: raceGoal.id },
          workoutType: { not: 'REST' },
        },
      }),
      this.prisma.runLog.findMany({
        where: {
          userId,
          raceGoalId: raceGoal.id,
          completedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
    ]);

    const plannedKm = this.sumDistance(
      plannedWorkouts.map((w) => w.plannedDistanceKm),
    );
    const actualKm = this.sumDistance(runLogs.map((r) => r.distanceKm));
    const daysUntilRace = this.daysBetween(new Date(), raceGoal.raceDate);

    return {
      raceDate: raceGoal.raceDate,
      daysUntilRace,
      thisWeek: {
        plannedKm,
        actualKm,
        completedRuns: runLogs.length,
        adherencePercent:
          plannedKm === 0 ? 0 : Math.round((actualKm / plannedKm) * 100),
      },
    };
  }

  async getWeekly(userId: string, weeks = 8) {
    const raceGoal = await this.prisma.raceGoal.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!raceGoal) {
      throw new NotFoundException('No active race goal found');
    }

    const safeWeeks = Math.min(Math.max(weeks, 1), 24);
    const { weekStart: currentWeekStart } = this.getCurrentWeekRange();
    const rangeStart = this.addDays(currentWeekStart, -(safeWeeks - 1) * 7);
    const rangeEnd = this.addDays(currentWeekStart, 6);

    const [plannedWorkouts, runLogs] = await Promise.all([
      this.prisma.plannedWorkout.findMany({
        where: {
          scheduledDate: { gte: rangeStart, lte: rangeEnd },
          trainingPlan: { raceGoalId: raceGoal.id },
          workoutType: { not: 'REST' },
        },
      }),
      this.prisma.runLog.findMany({
        where: {
          userId,
          raceGoalId: raceGoal.id,
          completedAt: { gte: rangeStart, lte: rangeEnd },
        },
      }),
    ]);

    const result: Array<{
      weekStart: string;
      plannedKm: number;
      actualKm: number;
    }> = [];

    for (let i = 0; i < safeWeeks; i++) {
      const start = this.addDays(rangeStart, i * 7);
      const end = this.addDays(start, 6);

      const plannedKm = this.sumDistance(
        plannedWorkouts
          .filter((w) => w.scheduledDate >= start && w.scheduledDate <= end)
          .map((w) => w.plannedDistanceKm),
      );

      const actualKm = this.sumDistance(
        runLogs
          .filter((r) => r.completedAt >= start && r.completedAt <= end)
          .map((r) => r.distanceKm),
      );

      result.push({
        weekStart: start.toISOString().slice(0, 10),
        plannedKm,
        actualKm,
      });
    }

    return result;
  }

  private getCurrentWeekRange() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay(); // 0=Sun ... 6=Sat
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = this.addDays(today, diffToMonday);
    const weekEnd = this.addDays(weekStart, 6);
    weekEnd.setHours(23, 59, 59, 999);
    return { weekStart, weekEnd };
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private daysBetween(from: Date, to: Date) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / msPerDay));
  }

  private sumDistance(values: number[]) {
    return Math.round(values.reduce((sum, v) => sum + v, 0) * 10) / 10;
  }
}
