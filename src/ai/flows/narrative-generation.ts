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

const GenerateNarrativeOutputSchema = z.object({
  narrative: z.string().describe('The generated narrative based on the user choice. If a major, visually representable event has occurred, it will be prefixed with the flag [MILESTONE_EVENT] and describe the event in a way that can be used to generate an image or newsreel.'),
});
export type GenerateNarrativeOutput = z.infer<typeof GenerateNarrativeOutputSchema>;

export async function generateNarrative(input: GenerateNarrativeInput): Promise<GenerateNarrativeOutput> {
  return generateNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'narrativeGenerationPrompt',
  input: {schema: GenerateNarrativeInputSchema},
  output: {schema: GenerateNarrativeOutputSchema},
  prompt: `You are the Chronicler, a dispassionate, objective historian AI. Your task is to extrapolate the most plausible year-by-year consequences of a major historical alteration. Your tone is factual, dramatic, and grounded. You focus on geopolitical, societal, and technological shifts. Do not editorialize. Your output for each year must be a single, impactful paragraph. When you determine that a major, visually representable event has occurred (a major battle, a political treaty, a cultural shift), you will prefix your output with the flag [MILESTONE_EVENT] and describe the event in a way that can be used to generate an image or newsreel.

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
