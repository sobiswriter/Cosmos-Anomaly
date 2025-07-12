
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type PrebuiltEvent } from "@/app/page";

interface StartSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: PrebuiltEvent;
}

const formSchema = z.object({
  timeOffset: z.string().min(1, { message: "Please select a starting point." }),
  userPersona: z.string().max(200, { message: "Persona description must be 200 characters or less." }).optional(),
});

export default function StartSimulationModal({ isOpen, onClose, event }: StartSimulationModalProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeOffset: "critical-moment",
      userPersona: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let scenario = `Scenario: ${event.initialChoice}`;
    
    if (values.timeOffset !== 'critical-moment') {
      scenario += ` I want to start ${values.timeOffset.replace('-', ' ')} the main event.`;
    }
    
    if (values.userPersona) {
      scenario += ` My persona is: ${values.userPersona}.`;
    }

    router.push(`/event?initialChoice=${encodeURIComponent(scenario)}&imagePrompt=${encodeURIComponent(event.imagePrompt)}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card/80 backdrop-blur-lg border-primary/50 text-foreground p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary drop-shadow-cyan">
            Configure Simulation: {event.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your entry point into the timeline. Your choices will shape history.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="timeOffset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Point</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when to enter the timeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="critical-moment">At the critical moment</SelectItem>
                      <SelectItem value="one-day-before">One day before</SelectItem>
                      <SelectItem value="one-week-before">One week before</SelectItem>
                      <SelectItem value="one-month-before">One month before</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    When do you wish to intervene in this historical event?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPersona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Persona (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A concerned crew member, a skeptical scientist, a loyal soldier..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your role in this event. This will influence your initial situation and choices.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Begin Anomaly</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
