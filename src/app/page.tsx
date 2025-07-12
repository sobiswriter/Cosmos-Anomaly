
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import Image from 'next/image';
import { CreateEventForm } from '@/components/create-event-form';

const prebuiltEvents = [
  {
    id: 'titanic',
    title: 'The Ship of Dreams',
    description: 'Step onto the deck of the RMS Titanic. The year is 1912. The night is cold, the ship is "unsinkable," and you hold the power to steer its destiny through the icy waters of the North Atlantic.',
    image: '/images/Titanic.png',
    aiHint: 'titanic ship',
    initialChoice: "You are aboard the RMS Titanic on its maiden voyage in April 1912. The night is freezing, and whispers of icebergs ahead are spreading amongst the crew. The ship feels invincible, but a sense of unease hangs in the frigid air.",
    imagePrompt: "The RMS Titanic sailing majestically through a calm, moonlit sea, a massive iceberg looming menacingly in the near distance. Neo-noir, ethereal style."
  },
  {
    id: 'apollo',
    title: 'The Red Triumph',
    description: "The year is 1968, deep within a secret Soviet cosmodrome. The monumental N1 rocket stands before you, a symbol of your nation's ambition—and its repeated failures. The Americans are winning the space race. Your next decision could change that.",
    image: '/images/Soviets.png',
    aiHint: 'soviet astronaut',
    initialChoice: "You are a lead engineer for the Soviet Space Program in 1968. The N1 moon rocket has failed its previous tests, and pressure from the Kremlin is immense. The fate of the Soviet lunar mission rests on your shoulders.",
    imagePrompt: "A massive Soviet N1 rocket stands on a launchpad in a brutalist, snow-dusted cosmodrome at dusk. Engineers in heavy coats scurry below. Dark, cinematic, high-contrast."
  },
  {
    id: 'orwell-1984',
    title: 'The Ever-Watching Eye',
    description: "In the aftermath of a devastating world war, a new world order is proposed—one of total control for total peace. As a delegate at the founding conference, will you usher in an age of stability or a nightmare of surveillance?",
    image: '/images/1984.png',
    aiHint: 'dystopian surveillance',
    initialChoice: "It is the year 1950. A devastating global war has just ended. At a summit in a neutral city, world leaders are debating the formation of a global government based on the principles of total security and surveillance to prevent future conflict. You are a key influencer at this summit.",
    imagePrompt: "A shadowy group of world leaders in silhouette, meeting around a large table in a grand, dimly lit hall. A single, stylized eye logo is projected on the wall behind them. Neo-noir, high-contrast, dystopian."
  },
  {
    id: 'newton',
    title: 'The Unseen Force',
    description: "Woolsthorpe Manor, 1666. A young Isaac Newton is on the cusp of greatness, but a simple moment of chance—or intervention—could send the history of science down a completely different path.",
    image: '/images/Newton.png',
aiHint: 'scientific instruments',
    initialChoice: "The year is 1666, at Woolsthorpe Manor. A young Isaac Newton is sitting under an apple tree, deep in thought, pondering the nature of the cosmos. An apple dangles from a branch just above his head, ready to fall. You are a silent observer, a temporal anomaly with the power to intervene.",
    imagePrompt: "A young Isaac Newton sitting thoughtfully under an apple tree, with an apple about to fall. The scene is lit by golden afternoon light, but with a sense of cosmic importance. Ethereal, neo-noir style."
  },
  {
    id: 'library',
    title: 'The Unburnt Library',
    description: 'The Great Library of Alexandria holds the accumulated knowledge of the ancient world. But the city is a tinderbox of political and religious strife. As a scholar within its walls, can you protect the wisdom of ages from the coming flame?',
    image: '/images/library.png',
    aiHint: 'ancient library',
    initialChoice: "You are a scholar in the Library of Alexandria in 48 BC. The city is in turmoil as Julius Caesar's forces battle the Egyptian army. Smoke is on the horizon, and the scent of fear mixes with the smell of old papyrus. The Library's fate is uncertain.",
    imagePrompt: "The grand interior of the Library of Alexandria, with scholars frantically trying to save scrolls as smoke seeps in through the high windows. Sunlight streams through marble pillars, illuminating dust and chaos. Neo-noir, ethereal style."
  },
  {
    id: 'british-raj',
    title: 'The Unbroken Raj',
    description: "India, 1947. The subcontinent is on the brink of independence, but the forces of the British Empire are determined to hold on. As a key figure in the negotiations, your actions will decide the fate of a billion people.",
    image: '/images/British.png',
    aiHint: 'colonial india',
    initialChoice: "The year is 1947, in New Delhi. You are a high-ranking British official meeting with Indian independence leaders. The air is thick with tension and the desire for freedom, but imperial pride and economic interests are powerful forces resisting change.",
    imagePrompt: "A tense negotiation between British officers in formal uniforms and Indian leaders in traditional attire, taking place in a grand, wood-paneled room. Maps of the subcontinent are spread on the table. Ethereal, neo-noir."
  }
];

export default function MainMenu() {
  return (
    <main className="p-4 md:p-6 lg:p-8 relative min-h-screen flex flex-col font-body bg-background text-foreground">
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
              <div className="aspect-video w-full overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={event.aiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{event.title}</CardTitle>
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

        <div className="my-12 md:my-16">
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-primary/30"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-lg font-headline text-primary">A WORD FROM THE CREATOR</span>
                </div>
            </div>
        </div>

        <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="font-headline text-3xl text-primary mb-2">Hey, I'm Sobi!</h3>
                <p className="text-muted-foreground mb-4">
                  I'm the temporal tinkerer who built this little universe. Chronos Anomaly started as a fascination with 'what if' scenarios and a desire to play with the incredible power of generative AI. It's a playground for history buffs, sci-fi fans, and anyone who's ever wondered how a tiny change could create a totally different future.
                </p>
                <p className="text-muted-foreground">
                  If you're having fun bending time and watching the consequences ripple across history, consider fueling future development. Every bit of support helps keep the timeline-monitoring servers running and the Watcher well-supplied with sarcasm. Thanks for playing!
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-48 h-48 relative border-2 border-dashed border-amber/50 rounded-lg p-2">
                    <Image 
                      src="/images/pay.png" 
                      alt="Payment QR Code Placeholder" 
                      width={192} 
                      height={192} 
                      className="object-contain w-full h-full"
                      data-ai-hint="payment qr"
                    />
                  </div>
                  <Button variant="outline" className="border-amber/50 text-amber/80 hover:bg-amber/10 hover:text-amber">
                    <Heart className="mr-2 h-4 w-4" /> Support the Project
                  </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
       <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>Your choices are your own. The consequences are for all time.</p>
      </footer>
    </main>
  );
}
