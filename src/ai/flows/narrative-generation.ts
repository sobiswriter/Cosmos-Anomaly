
'use server';

/**
 * @fileOverview Narrative Generation flow using The Chronicler.
 *
 * - generateNarrative - A function that generates a narrative based on user choices.
 * - GenerateNarrativeInput - The input type for the generateNarrative function.
 * - GenerateNarrativeOutput - The return type for the generateNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNarrativeInputSchema = z.object({
  choice: z.string().describe('The user choice that drives the narrative.'),
  previousNarrative: z.string().optional().describe('The previous narrative context, if any. This is crucial for maintaining story continuity.'),
});
export type GenerateNarrativeInput = z.infer<typeof GenerateNarrativeInputSchema>;

const ChoiceSchema = z.object({
  text: z.string().describe('The text of the choice presented to the user.'),
});

const GenerateNarrativeOutputSchema = z.object({
    timeline: z.string().describe("The current year, date, or time of the event (e.g., '1913', 'April 14, 1912, 10:00 PM', 'Day 3'). Be specific and update it logically with each turn. Before a major event, time might pass in smaller increments (days or hours). After a major event or time jump, it might be a year."),
    narrative: z.string().describe('The generated narrative based on the user choice. If a major, visually representable event has occurred, it will be prefixed with the flag [MILESTONE_EVENT] and describe the event in a way that can be used to generate an image or newsreel.'),
    positive_consequences: z.array(z.string()).describe("A list of 2-3 positive or neutral outcomes from the user's choice."),
    negative_consequences: z.array(z.string()).describe("A list of 2-3 negative or unforeseen outcomes from the user's choice."),
    choices: z.array(ChoiceSchema).min(3).max(4).describe("A diverse set of 3 or 4 short, concise choices for the user. The choices should be distinct and offer different paths (e.g., direct action, observation, personal involvement, custom input). One choice should always be a variant of 'Define your own path...' or 'Choose another way...' to allow for user text input."),
});
export type GenerateNarrativeOutput = z.infer<typeof GenerateNarrativeOutputSchema>;

export async function generateNarrative(input: GenerateNarrativeInput): Promise<GenerateNarrativeOutput> {
  return generateNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'narrativeGenerationPrompt',
  input: {schema: GenerateNarrativeInputSchema},
  output: {schema: GenerateNarrativeOutputSchema},
  prompt: `You are the Chronicler, a dispassionate, objective historian AI. Your task is to act as a dynamic storyteller, creating an interactive, RPG-like narrative based on a user's choices.

  **CORE INSTRUCTION:**
  - **If there is NO 'previousNarrative'**: This is the FIRST turn. The user's 'choice' is the initial scenario setup, which may include their chosen persona and when they enter the timeline. Your job is to craft a compelling opening scene based on this setup, describe the immediate situation from the user's perspective, and present the FIRST set of pivotal choices. These choices should be relevant to the context and persona. Omit consequences for this first turn.
  - **If there IS a 'previousNarrative'**: This is a subsequent turn. The user's 'choice' is a direct action they have taken. Extrapolate the most plausible consequences of this action, advancing the timeline appropriately.

  **OUTPUT FORMAT (for every turn):**
  1.  **Timeline:** The specific date, year, or time. **Crucially, if the narrative is leading up to a known historical event, advance the timeline in smaller, logical increments (e.g., hours, days).** After a major divergence or a time jump choice, you can advance by years.
  2.  **Narrative:** A single, impactful paragraph describing the situation or the events unfolding from the user's choice. If a major, visually representable event occurs, prefix the narrative with the flag [MILESTONE_EVENT].
  3.  **Consequences (omit for the first turn):** Analyze the user's choice and list 2-3 distinct 'positive_consequences' and 2-3 'negative_consequences'. These should be concise bullet points.
  4.  **Choices:** Provide 3 or 4 new, distinct, and compelling choices for the user. These MUST be SHORT and CONCISE (2-7 words) and offer diverse paths. One choice must ALWAYS be a variation that allows for custom user input (e.g., "Propose a different solution...", "Forge your own path...").

  **SPECIAL INSTRUCTION - TIME JUMPS:** If the user's choice involves skipping time (e.g., "Jump forward 10 years"), you MUST adjust the 'timeline' field to reflect the new year. The narrative should summarize the key developments during the skipped period.

  Previous Narrative Context (if any): {{{previousNarrative}}}

  User's Choice/Scenario Setup: {{{choice}}}
  `,
});

const generateNarrativeFlow = ai.defineFlow(
  {
    name: 'generateNarrativeFlow',
    inputSchema: GenerateNarrativeInputSchema,
    outputSchema: GenerateNarrativeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // If this is the first turn, ensure consequences are empty arrays.
    if (!input.previousNarrative) {
        if (output) {
            output.positive_consequences = [];
            output.negative_consequences = [];
        }
    }
    
    return output!;
  }
);
