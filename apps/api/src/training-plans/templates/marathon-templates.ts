import { WorkoutType } from '@prisma/client';

export type DayTemplate = {
  workoutType: WorkoutType;
  distanceShare: number;
  title: string;
};

export type WeekPattern = DayTemplate[];

export const MARATHON_WEEK_PATTERNS: Record<3 | 4 | 5, WeekPattern> = {
  3: [
    { workoutType: 'EASY', distanceShare: 0.25, title: 'Easy run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'TEMPO', distanceShare: 0.3, title: 'Tempo run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'LONG', distanceShare: 0.45, title: 'Long run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
  ],
  4: [
    { workoutType: 'EASY', distanceShare: 0.2, title: 'Easy run' },
    { workoutType: 'EASY', distanceShare: 0.15, title: 'Easy run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'TEMPO', distanceShare: 0.25, title: 'Tempo run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'LONG', distanceShare: 0.4, title: 'Long run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
  ],
  5: [
    { workoutType: 'EASY', distanceShare: 0.15, title: 'Easy run' },
    { workoutType: 'TEMPO', distanceShare: 0.2, title: 'Tempo run' },
    { workoutType: 'EASY', distanceShare: 0.15, title: 'Easy run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
    { workoutType: 'EASY', distanceShare: 0.15, title: 'Easy run' },
    { workoutType: 'LONG', distanceShare: 0.35, title: 'Long run' },
    { workoutType: 'REST', distanceShare: 0, title: 'Rest' },
  ],
};
