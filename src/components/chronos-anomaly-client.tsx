
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, History, Loader2, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Choice } from '@/lib/story';
import { type TimelineEvent } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { generateNarrative, type GenerateNarrativeOutput } from '@/ai/flows/narrative-generation';
import { generateImage } from '@/ai/flows/asset-generation';
import { getWatcherCommentary } from '@/ai/flows/ai-commentary';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import MilestoneModal from '@/components/milestone-modal';
import Link from 'next/link';
import CustomChoiceModal from './custom-choice-modal';
import { Separator } from './ui/separator';

const MILESTONE_FLAG = '[MILESTONE_EVENT]';
const CUSTOM_CHOICE_KEYWORDS = ['path', 'way', 'define', 'choose', 'another', '...'];

interface ChronosAnomalyClientProps {
  initialChoice: string;
  initialImagePrompt: string;
}

export default function ChronosAnomalyClient({ initialChoice, initialImagePrompt }: ChronosAnomalyClientProps) {
  const [timeline, setTimeline] = useLocalStorage<TimelineEvent[]>(`chronos-timeline-${initialChoice}`, []);
  const [narrativeData, setNarrativeData] = useState<Partial<GenerateNarrativeOutput>>({});
  const [imageUrl, setImageUrl] = useState<string>('');
  const [commentary, setCommentary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [milestoneEvent, setMilestoneEvent] = useState<{imageUrl: string; narrative: string} | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isCustomChoiceModalOpen, setCustomChoiceModalOpen] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isCustomChoice = (choiceText: string) => {
    const lowerCaseText = choiceText.toLowerCase();
    return CUSTOM_CHOICE_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
  };
  
  const processChoice = async (choice: { text: string }) => {
    setIsLoading(true);
    setCustomChoiceModalOpen(false);

    try {
      const previousNarrative = narrativeData.narrative;
      
      setNarrativeData({ narrative: "Recalibrating timeline..."});
      setImageUrl('');
      setCommentary('');
      setChoices([]);

      const narrativeResult : GenerateNarrativeOutput = await generateNarrative({ choice: choice.text, previousNarrative });

      let displayNarrative = narrativeResult.narrative;
      let imagePrompt : string | undefined = undefined;
      let isMilestone = false;
      let milestoneNarrativeForModal = '';

      if (narrativeResult.narrative.includes(MILESTONE_FLAG)) {
        isMilestone = true;
        const parts = narrativeResult.narrative.split(MILESTONE_FLAG);
        displayNarrative = parts[0].trim();
        const milestoneContent = parts.length > 1 ? parts[1].trim() : '';
        imagePrompt = milestoneContent;
        milestoneNarrativeForModal = milestoneContent;

        if (!displayNarrative) {
          displayNarrative = milestoneContent;
        }
      }

      if (narrativeResult.timeline && displayNarrative.startsWith(narrativeResult.timeline)) {
        displayNarrative = displayNarrative.substring(narrativeResult.timeline.length).replace(/^[\.\s]*/, '').trim();
      }

      if (!imagePrompt) {
        imagePrompt = `An abstract representation of the following event: ${displayNarrative}`;
      }
      
      const commentaryInput = {
        timelineEvent: displayNarrative,
        userChoice: choice.text,
        currentTimeline: timeline.map(t => t.choiceMade).join(' -> '),
      };

      const [imageResult, commentaryResult] = await Promise.all([
        generateImage({ narrativeMoment: imagePrompt }),
        getWatcherCommentary(commentaryInput),
      ]);
      
      const updatedNarrativeResult = {...narrativeResult, narrative: displayNarrative};

      const newTimelineEvent: TimelineEvent = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        choiceMade: choice.text,
        generatedNarrative: updatedNarrativeResult,
        imageUrl: imageResult.imageUrl,
        watcherCommentary: commentaryResult.commentary,
        choices: narrativeResult.choices || [], 
      };

      setTimeline(prev => [...prev, newTimelineEvent]);
      setNarrativeData(updatedNarrativeResult);
      setImageUrl(imageResult.imageUrl);
      setCommentary(commentaryResult.commentary);
      setChoices(narrativeResult.choices || []);

      if (isMilestone) {
        setMilestoneEvent({ imageUrl: imageResult.imageUrl, narrative: milestoneNarrativeForModal });
      }

    } catch (error) {
      console.error("Failed to process choice:", error);
      toast({
        variant: "destructive",
        title: "Temporal Anomaly Detected",
        description: "Failed to connect with the Consequence Engine. Please try again.",
      });
      const lastEvent = timeline.length > 0 ? timeline[timeline.length - 1] : null;
      if (lastEvent) {
        setNarrativeData(lastEvent.generatedNarrative);
        setImageUrl(lastEvent.imageUrl);
        setCommentary(lastEvent.watcherCommentary);
        setChoices(lastEvent.choices);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectChoice = (choice: Choice) => {
    if (isCustomChoice(choice.text)) {
      setCustomChoiceModalOpen(true);
    } else {
      processChoice(choice);
    }
  };
  
  const handleReset = useCallback(async () => {
    setIsLoading(true);
    try {
      setTimeline([]);
      await processChoice({ text: initialChoice });

      toast({
        title: "Timeline Reset",
        description: "The echoes of your choices have faded.",
      });
    } catch (error) {
      console.error("Failed to reset timeline:", error);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Could not reset the timeline. The anomaly persists.",
      });
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTimeline, toast, initialChoice]);
  
  useEffect(() => {
    if (!isMounted) return;

    const initialize = async () => {
      setIsLoading(true);
      try {
        if (timeline.length > 0) {
          const lastEvent = timeline[timeline.length - 1];
          setNarrativeData(lastEvent.generatedNarrative);
          setImageUrl(lastEvent.imageUrl);
          setCommentary(lastEvent.watcherCommentary);
          setChoices(lastEvent.choices);
        } else {
          setCommentary("The Watcher is observing. The first choice has been made.");
          await processChoice({ text: initialChoice });
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        toast({
          variant: "destructive",
          title: "Initialization Failed",
          description: "Could not render the initial timeline state.",
        });
        setTimeline([]);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, initialChoice]);

  const reversedTimeline = useMemo(() => [...timeline].reverse(), [timeline]);

  const getEventIdForAccordion = (event: TimelineEvent, index: number) => {
    const totalEvents = timeline.length;
    const eventNumber = totalEvents - index;
    const shortChoice = event.choiceMade.length > 30 ? `${event.choiceMade.substring(0, 27)}...` : event.choiceMade;
    return `Event ${eventNumber}: ${shortChoice}`;
  }


  return (
    <>
      <MilestoneModal 
        isOpen={!!milestoneEvent}
        onClose={() => setMilestoneEvent(null)}
        imageUrl={milestoneEvent?.imageUrl || ""}
        narrative={milestoneEvent?.narrative || ""}
      />
      <CustomChoiceModal
        isOpen={isCustomChoiceModalOpen}
        onClose={() => setCustomChoiceModalOpen(false)}
        onSubmit={(customChoice) => processChoice({ text: customChoice })}
      />
      <main className="p-4 md:p-6 lg:p-8 relative min-h-screen flex flex-col font-body">
        <header className="text-center mb-6 md:mb-8 relative">
           <Link href="/" className="absolute top-0 left-0 text-primary hover:text-amber transition-colors z-10">
            &larr; Back to Horizon
          </Link>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-amber drop-shadow-amber animate-pulse">
            Chronos Anomaly
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">Echoes of Choice</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-0 right-0 border-amber/30 text-amber/80 hover:bg-amber/10 hover:text-amber">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Timeline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to revert time?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your current timeline will be permanently erased, and you will return to the beginning of this event.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/80">Erase Timeline</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 h-full flex-grow">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 order-3 lg:order-1">
            <Card className="bg-card/50 backdrop-blur-sm border-amber/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-amber">
                  <Eye className="w-5 h-5" /> The Watcher's Gaze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={commentary}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-amber/80 italic text-sm leading-relaxed"
                    >
                      {isLoading && !commentary ? "..." : commentary}
                    </motion.p>
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="flex-grow flex flex-col bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                  <History className="w-5 h-5" /> Timeline Echoes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4">
                 {isMounted && (
                    <Accordion type="single" collapsible className="w-full">
                      {reversedTimeline.length > 0 ? (
                        reversedTimeline.map((event, index) => (
                          <AccordionItem key={event.id} value={`item-${event.id}`}>
                            <AccordionTrigger className="text-left">{getEventIdForAccordion(event, index)}</AccordionTrigger>
                            <AccordionContent className="space-y-2">
                              <p className="text-sm text-muted-foreground">{event.generatedNarrative.narrative}</p>
                              <p className="text-xs italic text-amber/60">Watcher: "{event.watcherCommentary}"</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground text-sm py-8">The timeline is pristine. For now.</p>
                      )}
                    </Accordion>
                  )}
                  {!isMounted && <div className="text-center text-muted-foreground text-sm py-8">Loading timeline...</div>}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6 order-1 lg:order-2">
            <Card className="aspect-video w-full bg-card/50 backdrop-blur-sm border-secondary overflow-hidden flex items-center justify-center">
              <AnimatePresence>
                {isLoading && !imageUrl ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <motion.div
                    key={imageUrl || 'placeholder'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={imageUrl || "https://placehold.co/1280x720/100818/100818.png"}
                      alt={"Awaiting temporal scan..."}
                      width={1280}
                      height={720}
                      className="object-cover w-full h-full"
                      data-ai-hint="celestial history"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card className="flex-grow p-6 flex flex-col justify-between bg-card/50 backdrop-blur-sm border-secondary order-2 lg:order-3">
              <ScrollArea className="flex-grow mb-6 pr-3">
                 {isLoading && narrativeData?.narrative?.includes('Recalibrating') ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ) : (
                   <AnimatePresence mode="wait">
                    <motion.div
                      key={narrativeData?.narrative}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className='font-headline text-2xl text-primary mb-2'>{narrativeData?.timeline || 'Calculating...'}</h2>
                      <p className="text-base md:text-lg leading-loose mb-6">
                        {isLoading && !narrativeData?.narrative ? '...' : narrativeData?.narrative}
                      </p>

                      {(narrativeData?.positive_consequences && narrativeData.positive_consequences.length > 0) || (narrativeData?.negative_consequences && narrativeData.negative_consequences.length > 0) ? <Separator className="my-4 bg-primary/20" /> : null}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {narrativeData.positive_consequences && narrativeData.positive_consequences.length > 0 && (
                          <div className='space-y-2'>
                            <h3 className='font-headline text-lg text-green-400 flex items-center gap-2'><ThumbsUp className='w-5 h-5' /> Positive Consequences</h3>
                            <ul className='list-disc list-inside text-muted-foreground space-y-1 text-sm'>
                              {narrativeData.positive_consequences.map((item, i) => <li key={i}>{item.replace(/^[\*\-\:]\s*/, '')}</li>)}
                            </ul>
                          </div>
                        )}
                         {narrativeData.negative_consequences && narrativeData.negative_consequences.length > 0 && (
                          <div className='space-y-2'>
                            <h3 className='font-headline text-lg text-red-400 flex items-center gap-2'><ThumbsDown className='w-5 h-5' /> Negative Consequences</h3>
                             <ul className='list-disc list-inside text-muted-foreground space-y-1 text-sm'>
                              {narrativeData.negative_consequences.map((item, i) => <li key={i}>{item.replace(/^[\*\-\:]\s*/, '')}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>

                    </motion.div>
                  </AnimatePresence>
                )}
              </ScrollArea>
              
              <div className="space-y-3 mt-4">
                {choices.length > 0 && <p className="text-center font-headline text-primary drop-shadow-cyan">What is your will?</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {choices.map((choice) => (
                    <Button
                      key={choice.text}
                      variant="outline"
                      size="lg"
                      className="text-lg font-headline border-primary/50 hover:bg-primary/20 hover:text-primary transition-all duration-300 h-auto py-4 whitespace-normal text-center"
                      onClick={() => handleSelectChoice(choice)}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {choice.text}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
