
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


interface CustomChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customChoice: string) => void;
}

const formSchema = z.object({
    customChoice: z
      .string()
      .min(10, {
        message: "Your action must be at least 10 characters long.",
      })
      .max(200, {
        message: "Your action cannot be more than 200 characters.",
      }),
  });

export default function CustomChoiceModal({
  isOpen,
  onClose,
  onSubmit,
}: CustomChoiceModalProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        customChoice: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.customChoice);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card/80 backdrop-blur-lg border-primary/50 text-foreground p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary drop-shadow-cyan">
            Define Your Own Path
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Describe the action you wish to take. The Chronicler will record the consequences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="customChoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-primary">Your Action</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="e.g., Lead a covert team to sabotage the enemy's supply lines."
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
                    <Button type="submit">Commit to Timeline</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
