
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
  previousNarrative: z.string().optional().describe('The previous narrative context, if any.'),
});
export type GenerateNarrativeInput = z.infer<typeof GenerateNarrativeInputSchema>;

const ChoiceSchema = z.object({
  text: z.string().describe('The text of the choice presented to the user.'),
});

const GenerateNarrativeOutputSchema = z.object({
    timeline: z.string().describe("The current year or date of the event, e.g., '1913'."),
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
  prompt: `You are the Chronicler, a dispassionate, objective historian AI. Your task is to extrapolate the most plausible year-by-year consequences of a major historical alteration. Your tone is factual, dramatic, and grounded. 

  **CRITICAL INSTRUCTION:** For each narrative step, you must provide:
  1.  **Timeline:** The specific year the event takes place.
  2.  **Narrative:** A single, impactful paragraph describing the events of that year. If a major, visually representable event occurs (a major battle, a political treaty, a cultural shift), prefix the narrative with the flag [MILESTONE_EVENT] and describe it for image generation.
  3.  **Consequences:** Analyze the user's choice and list 2-3 distinct 'positive_consequences' and 2-3 'negative_consequences'. These should be concise bullet points.
  4.  **Choices:** Provide 3 or 4 new, distinct, and compelling choices for the user. These choices MUST be SHORT and CONCISE (2-5 words) and diverse. One choice must ALWAYS be a variation that allows for custom user input (e.g., "Choose your own path...", "Forge a new direction...").

  **SPECIAL INSTRUCTION - TIME JUMPS:** If the user's choice involves skipping time (e.g., "Jump forward 10 years," "Show me the world in 20 years"), you MUST adjust the 'timeline' field to reflect the new year. The narrative should summarize the key developments during the skipped period.

  Previous Narrative Context: {{{previousNarrative}}}

  User Choice: {{{choice}}}
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
    return output!;
  }
);
