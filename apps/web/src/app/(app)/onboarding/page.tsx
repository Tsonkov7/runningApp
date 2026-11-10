import { OnboardingForm } from "./onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Set your marathon goal</h1>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your race and current training so we can build a plan.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
