import ChronosAnomalyClient from '@/components/chronos-anomaly-client';
import OnboardingCinematic from '@/components/onboarding-cinematic';

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <OnboardingCinematic>
        <ChronosAnomalyClient />
      </OnboardingCinematic>
    </div>
  );
}
