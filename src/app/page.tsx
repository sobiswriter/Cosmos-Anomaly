
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import { CreateEventForm } from '@/components/create-event-form';

const prebuiltEvents = [
  {
    id: 'titanic',
    title: 'The Ship of Dreams',
    description: 'What if the RMS Titanic never sank? Explore a world where the tragedy was averted, and the gilded age of ocean liners continued, altering the course of maritime law, technology, and class structure.',
    image: 'https://placehold.co/600x400/100818/7DF9FF.png',
    aiHint: 'titanic ship',
    initialChoice: "Avert the sinking of the RMS Titanic on its maiden voyage in 1912.",
    imagePrompt: "The RMS Titanic sailing majestically through a calm, moonlit sea, icebergs safely in the distance. Neo-noir, ethereal style."
  },
  {
    id: 'apollo',
    title: 'The Red Triumph',
    description: 'What if the Soviet Union landed on the moon first? Witness a reality where the space race had a different victor, leading to a prolonged Cold War, a Soviet-dominated space, and a different technological trajectory.',
    image: 'https://placehold.co/600x400/100818/FFBF00.png',
    aiHint: 'soviet astronaut',
    initialChoice: "Ensure the Soviet N1 rocket succeeds, leading to a Soviet moon landing before Apollo 11 in 1969.",
    imagePrompt: "A Soviet cosmonaut plants a red flag with a hammer and sickle on the moon's surface, with the Earth glowing in the dark sky. Dark, cinematic, high-contrast."
  },
   {
    id: 'library-of-alexandria',
    title: 'The Unburnt Library',
    description: "What if the Great Library of Alexandria was never destroyed? Explore a timeline where centuries of ancient knowledge were preserved, accelerating scientific discovery and philosophical thought.",
    image: 'https://placehold.co/600x400/100818/7DF9FF.png',
    aiHint: 'ancient library',
    initialChoice: "Prevent the destruction of the Library of Alexandria.",
    imagePrompt: "A grand, sprawling ancient library filled with scholars, scrolls, and celestial models, light streaming through marble columns. Ethereal, neo-noir lighting."
  }
];

export default function MainMenu() {
  return (
    <main className="p-4 md:p-6 lg:p-8 relative min-h-screen flex flex-col font-body bg-background text-foreground">
      <div className="film-grain"></div>
      <header className="text-center mb-10 md:mb-12">
        <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl text-amber drop-shadow-amber animate-pulse">
          Horizon of the Chronos Anomaly
        </h1>
        <p className="text-muted-foreground text-md md:text-lg mt-2">The timelines are fractured. Choose a divergence point.</p>
      </header>
      
      <div className="flex-grow">
        <h2 className="font-headline text-3xl text-primary drop-shadow-cyan mb-6 text-center">Pre-defined Divergence Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prebuiltEvents.map((event) => (
            <Card key={event.id} className="bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col overflow-hidden transform hover:scale-105 hover:border-primary transition-all duration-300">
              <CardHeader>
                <div className="aspect-video w-full overflow-hidden rounded-t-lg -mt-6 -mx-6">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={event.aiHint}
                    />
                </div>
                <CardTitle className="font-headline text-2xl text-primary pt-4">{event.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <Link href={`/event?initialChoice=${encodeURIComponent(event.initialChoice)}&imagePrompt=${encodeURIComponent(event.imagePrompt)}`} className="w-full">
                  <Button variant="outline" className="w-full text-lg font-headline border-primary/50 hover:bg-primary/20 hover:text-primary">
                    Start Simulation <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="my-12 md:my-16">
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-amber/30"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-lg font-headline text-amber">OR</span>
                </div>
            </div>
        </div>
        
        <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border-amber/20">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-amber text-center">Forge Your Own Timeline</CardTitle>
                <CardDescription className="text-muted-foreground text-center">Describe a historical event you wish to alter. The Consequence Engine will calculate the ripples.</CardDescription>
            </CardHeader>
            <CardContent>
                <CreateEventForm />
            </CardContent>
        </Card>

      </div>
       <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>Your choices are your own. The consequences are for all time.</p>
      </footer>
    </main>
  );
}
