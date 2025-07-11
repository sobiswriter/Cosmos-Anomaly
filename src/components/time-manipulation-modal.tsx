
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


interface TimeManipulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (timeChoice: string) => void;
}

const formSchema = z.object({
    timeChoice: z
      .string()
      .min(10, {
        message: "Your time manipulation command must be at least 10 characters long.",
      })
      .max(200, {
        message: "Your command cannot be more than 200 characters.",
      }),
  });

export default function TimeManipulationModal({
  isOpen,
  onClose,
  onSubmit,
}: TimeManipulationModalProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        timeChoice: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.timeChoice);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card/80 backdrop-blur-lg border-amber/50 text-foreground p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-amber drop-shadow-amber">
            Manipulate the Timeline
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Describe how you want to alter the flow of time. The Chronicler will summarize the consequences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="timeChoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-amber">Time Jump Command</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="e.g., 'Jump forward 25 years and show me the state of global politics.' or 'Fast forward to the year 2000.'"
                            className="resize-y"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-amber text-black hover:bg-amber/90">Commit to Timeline</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
