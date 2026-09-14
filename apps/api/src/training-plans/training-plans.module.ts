import { Module } from '@nestjs/common';
import { PlanGeneratorService } from './plan-generator.service';
import { TrainingPlansController } from './training-plans.controller';
import { TrainingPlansService } from './training-plans.service';

@Module({
  controllers: [TrainingPlansController],
  providers: [TrainingPlansService, PlanGeneratorService],
  exports: [TrainingPlansService],
})
export class TrainingPlansModule {}
