import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkoutType } from '@prisma/client';
import { MARATHON_WEEK_PATTERNS } from './templates/marathon-templates';

export type GeneratePlanInput = {
  raceDate: Date;
  baselineWeeklyMileageKm: number;
  baselineLongestRunKm: number;
  daysPerWeek: number;
};

export type GeneratedWorkout = {
  scheduledDate: Date;
  weekNumber: number;
  workoutType: WorkoutType;
  plannedDistanceKm: number;
  title: string;
  description?: string;
};

export type GeneratedPlan = {
  startDate: Date;
  endDate: Date;
  planMetadata: {
    totalWeeks: number;
    peakWeeklyMileageKm: number;
    taperWeeks: number;
    daysPerWeek: number;
  };
  workouts: GeneratedWorkout[];
};

@Injectable()
export class PlanGeneratorService {
  private readonly MIN_WEEKS = 8;
  private readonly MAX_WEEKS = 18;
  private readonly TAPER_WEEKS = 2;
  private readonly WEEKLY_INCREASE = 1.1;
  private readonly PEAK_MULTIPLIER = 1.4;
  private readonly MAX_WEEKLY_KM = 70;
  private readonly MAX_LONG_RUN_KM = 32;

  generate(input: GeneratePlanInput): GeneratedPlan {
    if (![3, 4, 5].includes(input.daysPerWeek)) {
      throw new BadRequestException('daysPerWeek must be 3, 4, or 5');
    }

    const totalWeeks = this.computeTotalWeeks(input.raceDate);
    const pattern = MARATHON_WEEK_PATTERNS[input.daysPerWeek as 3 | 4 | 5];

    const weeklyMileages = this.buildWeeklyMileages(
      input.baselineWeeklyMileageKm,
      totalWeeks,
    );

    const startDate = this.addDays(input.raceDate, -(totalWeeks * 7 - 1));
    const endDate = this.addDays(input.raceDate, -1);

    const workouts: GeneratedWorkout[] = [];

    for (let week = 1; week <= totalWeeks; week++) {
      const weekMileage = weeklyMileages[week - 1];
      const weekStart = this.addDays(startDate, (week - 1) * 7);

      pattern.forEach((day, dayIndex) => {
        const scheduledDate = this.addDays(weekStart, dayIndex);
        if (scheduledDate > endDate) return;

        let distance = this.round1(weekMileage * day.distanceShare);

        if (day.workoutType === 'LONG') {
          distance = Math.min(
            distance,
            this.MAX_LONG_RUN_KM,
            Math.max(input.baselineLongestRunKm, distance),
          );
          distance = this.round1(distance);
        }

        if (day.workoutType === 'REST') {
          distance = 0;
        }

        workouts.push({
          scheduledDate,
          weekNumber: week,
          workoutType: day.workoutType,
          plannedDistanceKm: distance,
          title: day.title,
          description:
            day.workoutType === 'REST'
              ? 'Recovery day'
              : `${day.title} · ~${distance} km`,
        });
      });
    }

    return {
      startDate,
      endDate,
      planMetadata: {
        totalWeeks,
        peakWeeklyMileageKm: Math.max(...weeklyMileages),
        taperWeeks: this.TAPER_WEEKS,
        daysPerWeek: input.daysPerWeek,
      },
      workouts,
    };
  }

  private computeTotalWeeks(raceDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilRace = Math.floor(
      (raceDate.getTime() - today.getTime()) / msPerDay,
    );
    const weeks = Math.floor(daysUntilRace / 7);

    if (weeks < this.MIN_WEEKS) {
      throw new BadRequestException(
        `Need at least ${this.MIN_WEEKS} weeks until race day`,
      );
    }

    return Math.min(weeks, this.MAX_WEEKS);
  }

  private buildWeeklyMileages(baseline: number, totalWeeks: number): number[] {
    const peak = Math.min(baseline * this.PEAK_MULTIPLIER, this.MAX_WEEKLY_KM);
    const buildWeeks = totalWeeks - this.TAPER_WEEKS;
    const mileages: number[] = [];

    let current = baseline;

    for (let i = 0; i < buildWeeks; i++) {
      mileages.push(this.round1(Math.min(current, peak)));
      current = Math.min(current * this.WEEKLY_INCREASE, peak);
    }

    mileages.push(this.round1(peak * 0.8));
    mileages.push(this.round1(peak * 0.6));

    return mileages;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private round1(value: number): number {
    return Math.round(value * 10) / 10;
  }
}
