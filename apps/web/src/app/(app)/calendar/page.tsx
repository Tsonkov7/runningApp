import { CalendarView } from "./calendar-view";

export default function CalendarPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Calendar</h1>
      <CalendarView />
    </main>
  );
}
