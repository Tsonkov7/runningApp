import { RunsListView } from "./runs-list-view";

export default function RunsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Run history</h1>
      <RunsListView />
    </main>
  );
}
