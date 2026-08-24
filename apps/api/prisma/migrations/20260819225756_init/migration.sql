-- CreateEnum
CREATE TYPE "RaceGoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('REST', 'EASY', 'LONG', 'TEMPO', 'INTERVAL', 'RACE_PACE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raceDate" DATE NOT NULL,
    "targetFinishTimeSec" INTEGER,
    "baselineWeeklyMileageKm" DOUBLE PRECISION NOT NULL,
    "baselineLongestRunKm" DOUBLE PRECISION NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "status" "RaceGoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL,
    "raceGoalId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "planMetadata" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedWorkout" (
    "id" TEXT NOT NULL,
    "trainingPlanId" TEXT NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "workoutType" "WorkoutType" NOT NULL,
    "plannedDistanceKm" DOUBLE PRECISION NOT NULL,
    "plannedDurationMin" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PlannedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raceGoalId" TEXT NOT NULL,
    "plannedWorkoutId" TEXT,
    "completedAt" DATE NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "rpe" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RaceGoal_userId_status_idx" ON "RaceGoal"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlan_raceGoalId_key" ON "TrainingPlan"("raceGoalId");

-- CreateIndex
CREATE INDEX "PlannedWorkout_trainingPlanId_scheduledDate_idx" ON "PlannedWorkout"("trainingPlanId", "scheduledDate");

-- CreateIndex
CREATE INDEX "RunLog_userId_completedAt_idx" ON "RunLog"("userId", "completedAt");

-- AddForeignKey
ALTER TABLE "RaceGoal" ADD CONSTRAINT "RaceGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_raceGoalId_fkey" FOREIGN KEY ("raceGoalId") REFERENCES "RaceGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedWorkout" ADD CONSTRAINT "PlannedWorkout_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunLog" ADD CONSTRAINT "RunLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunLog" ADD CONSTRAINT "RunLog_raceGoalId_fkey" FOREIGN KEY ("raceGoalId") REFERENCES "RaceGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunLog" ADD CONSTRAINT "RunLog_plannedWorkoutId_fkey" FOREIGN KEY ("plannedWorkoutId") REFERENCES "PlannedWorkout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
