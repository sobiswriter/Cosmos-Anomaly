
'use client';

import ChronosAnomalyClient from '@/components/chronos-anomaly-client';
import OnboardingCinematic from '@/components/onboarding-cinematic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function EventPageContent() {
  const searchParams = useSearchParams();
  const initialChoice = searchParams.get('initialChoice') || 'An unknown anomaly has occurred.';
  const imagePrompt = searchParams.get('imagePrompt') || 'A shadowy figure stands before a swirling vortex of clocks and historical images.';

  return (
    <OnboardingCinematic>
      <ChronosAnomalyClient initialChoice={initialChoice} initialImagePrompt={imagePrompt} />
    </OnboardingCinematic>
  );
}

export default function EventPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading Event...</div>}>
        <EventPageContent />
      </Suspense>
    </div>
  );
}
