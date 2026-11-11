import { WorkoutDetailView } from "./workouts-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function WorkoutPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Workout</h1>
      <WorkoutDetailView id={id} />
    </>
  );
}
