
'use client';

import {useState, useEffect, ReactNode} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useLocalStorage} from '@/hooks/use-local-storage';
import {generateSpeech} from '@/ai/flows/tts-generation';
import {Loader2} from 'lucide-react';
import Image from 'next/image';

const ONBOARDING_SEEN_KEY = 'chronos-onboarding-seen';
const VOICEOVER_TEXT =
  'We have been watching. We have seen the infinite possibilities, the echoes of what could have been. Now, it is your turn. Welcome to the Observatory.';

export default function OnboardingCinematic({children}: {children: ReactNode}) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage(
    ONBOARDING_SEEN_KEY,
    false
  );
  const [isMounted, setIsMounted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !hasSeenOnboarding) {
      const getAudio = async () => {
        try {
          setIsLoadingAudio(true);
          const {audioDataUri} = await generateSpeech({text: VOICEOVER_TEXT});
          setAudioUrl(audioDataUri);
        } catch (error) {
          console.error('Failed to generate speech:', error);
          // Proceed without audio if it fails
        } finally {
          setIsLoadingAudio(false);
        }
      };
      getAudio();
    }
  }, [isMounted, hasSeenOnboarding]);

  useEffect(() => {
    if (currentScreen > 0 && audioUrl) {
      const audio = new Audio(audioUrl);
      const playAudio = () => {
        audio.play().catch(e => console.error("Audio play failed:", e));
      };
      
      // Delay playback slightly to sync with visuals
      const timeoutId = setTimeout(playAudio, 2000);

      return () => {
        clearTimeout(timeoutId);
        audio.pause();
      };
    }
  }, [currentScreen, audioUrl]);

  const handleAnimationComplete = () => {
    // This function will be called to transition to the next screen or end the cinematic
    // For now, it just ends
    setHasSeenOnboarding(true);
  };
  
   useEffect(() => {
    if (isMounted && !hasSeenOnboarding && !isLoadingAudio) {
        setCurrentScreen(1); // Start the cinematic
    }
  }, [isMounted, hasSeenOnboarding, isLoadingAudio])


  if (!isMounted) {
    return null; // or a loading spinner, but null avoids flash of content
  }

  if (hasSeenOnboarding) {
    return <>{children}</>;
  }

  if (isLoadingAudio) {
     return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-primary">
         <Loader2 className="w-16 h-16 animate-spin text-primary drop-shadow-cyan" />
         <p className="mt-4 text-lg font-headline">Calibrating The Loom...</p>
      </div>
     )
  }

  return (
    <AnimatePresence onExitComplete={() => setHasSeenOnboarding(true)}>
      {currentScreen === 1 && (
        <motion.div
          key="screen1"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 1.5, delay: 10.5}}}
          className="absolute inset-0 bg-black z-50 overflow-hidden"
          onAnimationComplete={handleAnimationComplete}
        >
          {/* 1. Pulsating Cyan Line */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary"
            style={{
              boxShadow: '0 0 15px 3px hsl(var(--primary)), 0 0 5px 1px hsl(var(--primary))',
              filter: 'blur(0.5px)',
            }}
            initial={{width: '0%', left: '50%'}}
            animate={{
              width: ['0%', '100%', '100%'],
              left: ['50%', '0%', '0%'],
              opacity: [0, 1, 1],
              transition: {duration: 2, ease: 'easeInOut'},
            }}
          >
             <motion.div 
                className="w-full h-full bg-primary"
                animate={{
                    opacity: [1, 0.7, 1],
                    transition: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 2 }
                }}
             />
          </motion.div>

          {/* 2. Observatory Reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 2, delay: 2}}}
          >
            <motion.div
              className="w-full h-full"
              initial={{scale: 1, y: '5%'}}
              animate={{scale: 1.15, y: '0%', transition: {duration: 8, delay: 2, ease: 'linear'}}}
            >
              <Image
                src="https://placehold.co/1920x1080/100818/7DF9FF.png"
                alt="Vast, dark observatory interior with a swirling galaxy visible through a large dome window."
                layout="fill"
                objectFit="cover"
                data-ai-hint="dark observatory"
                className="opacity-40"
              />
            </motion.div>
          </motion.div>
          
          {/* Ambient Dust Particles */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/30 rounded-full"
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: Math.random() * 0.5 + 0.1,
                  opacity: 0
                }}
                animate={{
                  opacity: [0, Math.random() * 0.4, 0],
                  x: `+=${(Math.random() - 0.5) * 100}px`,
                  y: `+=${(Math.random() - 0.5) * 100}px`,
                  transition: {
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    delay: 2.5
                  },
                }}
              />
            ))}
          </div>

          {/* 3. Focus on Loom of Time (Console) */}
          <motion.div
             className="absolute inset-0 flex items-center justify-center"
             initial={{opacity: 0}}
             animate={{opacity: 1, transition: {delay: 10, duration: 2}}}
          >
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-amber rounded-full opacity-20 blur-2xl drop-shadow-amber" />
              <div className="absolute inset-4 bg-amber rounded-full opacity-30 blur-lg drop-shadow-amber" />
              <p className="absolute inset-0 flex items-center justify-center text-center text-amber font-headline text-lg">The Loom of Time</p>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
