
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  eventDescription: z
    .string()
    .min(20, {
      message: "Please provide a more detailed description (at least 20 characters).",
    })
    .max(300, {
        message: "Description must not be longer than 300 characters.",
    }),
});

export function CreateEventForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const initialChoice = values.eventDescription;
    const imagePrompt = `An artistic interpretation of the historical event: "${initialChoice}"`;
    
    router.push(`/event?initialChoice=${encodeURIComponent(initialChoice)}&imagePrompt=${encodeURIComponent(imagePrompt)}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary text-lg">Historical Divergence Point</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., What if the dinosaurs were never wiped out by an asteroid?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Clearly state the single point of change in history.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full text-lg font-headline bg-amber text-black hover:bg-amber/90">
            Start Simulation <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
}
