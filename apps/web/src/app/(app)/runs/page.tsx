import { RunsListView } from "./runs-list-view";

export default function RunsPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Run history</h1>
      <RunsListView />
    </>
  );
}
