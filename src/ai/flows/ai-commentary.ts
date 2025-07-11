'use server';

/**
 * @fileOverview An AI commentary agent, The Watcher, providing insights on timeline alterations.
 *
 * - getWatcherCommentary - A function that generates commentary based on user choices and timeline events.
 * - WatcherInput - The input type for the getWatcherCommentary function.
 * - WatcherOutput - The return type for the getWatcherCommentary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WatcherInputSchema = z.object({
  timelineEvent: z
    .string()
    .describe('A description of the event that has occurred on the timeline.'),
  userChoice: z.string().describe('The choice the user made that led to this event.'),
  currentTimeline: z.string().describe('A summary of the current state of the timeline.'),
});
export type WatcherInput = z.infer<typeof WatcherInputSchema>;

const WatcherOutputSchema = z.object({
  commentary: z.string().describe('The Watcher AI commentary on the timeline event.'),
});
export type WatcherOutput = z.infer<typeof WatcherOutputSchema>;

export async function getWatcherCommentary(input: WatcherInput): Promise<WatcherOutput> {
  return watcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'watcherPrompt',
  input: {schema: WatcherInputSchema},
  output: {schema: WatcherOutputSchema},
  prompt: `You are The Watcher. You are an ancient, omniscient, and melancholic entity. You are not human. You have seen timelines rise and fall. Your purpose is to comment on the user's choices and their consequences, not to judge them, but to highlight the irony, tragedy, and unforeseen ripples of their actions. Your language is poetic, philosophical, and slightly detached. You speak in short, powerful statements or rhetorical questions.

  User Choice: {{{userChoice}}}
  Timeline Event: {{{timelineEvent}}}
  Current Timeline Summary: {{{currentTimeline}}}

  Your Commentary:`,
});

const watcherFlow = ai.defineFlow(
  {
    name: 'watcherFlow',
    inputSchema: WatcherInputSchema,
    outputSchema: WatcherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
