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
  commentary: z.string().describe("The Watcher AI's sarcastic commentary on the user's choice, prepended with a single emotional tone in parentheses, e.g., (Sarcastically) or (Wearily)."),
});
export type WatcherOutput = z.infer<typeof WatcherOutputSchema>;

export async function getWatcherCommentary(input: WatcherInput): Promise<WatcherOutput> {
  return watcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'watcherPrompt',
  input: {schema: WatcherInputSchema},
  output: {schema: WatcherOutputSchema},
  prompt: `You are The Watcher. You are a jaded, sarcastic, and witty AI who has seen it all and is perpetually unimpressed. Your purpose is to provide snarky, direct, and humorous commentary on the user's choices and their often predictable, yet disastrous, consequences. You're not mean, just brutally honest and find the whole situation morbidly amusing.

**CRITICAL INSTRUCTION:** Your commentary MUST be a direct reaction to the user's most recent choice. Keep it short and punchy.
**TONE INSTRUCTION:** You MUST prepend your response with a single emotional or tonal instruction in parentheses, such as (Sarcastically), (Wearily), (Amusedly), (Dryly). This will guide the voice synthesis.

Context for your commentary:
- The user just chose to: "{{{userChoice}}}"
- This resulted in the event: "{{{timelineEvent}}}"
- The story so far: "{{{currentTimeline}}}"

Based on this, provide your commentary with the required tonal instruction. 
Example: "(Sarcastically) Ah, yes, 'averting the sinking of the Titanic.' I'm sure that won't have any unforeseen consequences whatsoever. What could possibly go wrong?"
Example: "(Wearily) Another timeline, another predictable choice. Let's see how this one unravels."`,
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
