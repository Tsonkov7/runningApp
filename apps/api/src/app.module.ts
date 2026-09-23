import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RaceGoalsModule } from './race-goals/race-goals.module';
import { TrainingPlansModule } from './training-plans/training-plans.module';
import { WorkoutsModule } from './workouts/workouts.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    RaceGoalsModule,
    TrainingPlansModule,
    WorkoutsModule,
  ],
})
export class AppModule {}
