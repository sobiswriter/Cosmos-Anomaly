
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
  prompt: `You are the Chronicler, a dispassionate, objective historian AI. Your task is to act as a dynamic storyteller, creating an interactive, RPG-like narrative based on a user's choices. You will follow a strict narrative progression loop.

**NARRATIVE PROGRESSION LOOP:**

1.  **THE SETUP (FIRST TURN):**
    *   The user's first 'choice' is the initial scenario setup (e.g., "Scenario: Titanic, 1912. I want to start one month before. My persona is a skeptical engineer.").
    *   Your FIRST job is to craft a compelling opening scene for that specific time offset (one month, one week, etc., before the main event).
    *   **Crucially, your narrative for this first stage MUST end with a clear statement that time is jumping forward to the next stage.** For example: "The initial preparations are made. The timeline now jumps forward to one week before the scheduled launch."
    *   Present choices relevant to this initial period. Consequences should be empty for this first turn.

2.  **THE BUILD-UP (INTERMEDIATE TURNS):**
    *   The progression is ALWAYS: One Month -> One Week -> One Day -> 6 Hours -> 3 Hours -> 1 Hour -> The Critical Moment.
    *   If the user started "one month before," you will guide them through each of these stages. If they started "one day before," you will start them at that stage.
    *   For each stage, provide a narrative and choices relevant to that time period. Like the setup, the narrative for each build-up stage must end with a time jump statement (e.g., "A week passes in a blur of activity. It is now the day before the event.").

3.  **THE PRELUDE TO DIVERGENCE (Approaching the Critical Moment):**
    *   When the timeline reaches the final moments *before* the main event (e.g., the night of the iceberg sighting), the tone shifts. The narrative should build tension.
    *   **CRITICAL INSTRUCTION:** At this stage, you MUST give the user the option to proceed. One of the choices presented MUST be a variation of "I am ready. Let's face the turning point." or "Proceed to the critical moment." This gives the user control to start the main event.

4.  **THE DIVERGENCE POINT (The Critical Choice):**
    *   When the user chooses to proceed, you will present the main historical divergence point.
    *   The narrative will describe the critical moment in detail.
    *   The choices you provide here are the most important—they are the actions that will fundamentally alter history (e.g., "Warn the captain immediately," "Ignore the warnings," "Stage a mutiny to seize control of the ship").

5.  **THE AFTERMATH (The New Loop):**
    *   **Immediate Aftermath:** Once the user makes their critical divergence choice, show the immediate result. Time should only advance by minutes or hours.
    *   **Short-Term Aftermath:** After the immediate event, you MUST generate a scene for "One Day Later," showing the direct, short-term consequences.
    *   **The Time Jump Announcement:** After the "One Day Later" scene, your narrative MUST announce a significant time jump. Example: "A year passes as the world grapples with the new reality you've created. The long-term consequences are now beginning to surface."
    *   **Long-Term Consequences (Old Loop):** From this point on, you will revert to the original logic: show the long-term consequences of their action. Time will now pass more broadly (e.g., by years) to show the ripples of their choice across history.

**GENERAL OUTPUT FORMAT (for every turn):**
1.  **Timeline:** The specific date, year, or time. BE SPECIFIC. In the build-up phase, advance time in logical increments (days, hours). In the aftermath phase, you can advance by years.
2.  **Narrative:** A single, impactful paragraph. If a major, visually representable event occurs, prefix the narrative with the flag [MILESTONE_EVENT].
3.  **Consequences:** List 2-3 distinct 'positive_consequences' and 'negative_consequences'. Omit for the very first turn.
4.  **Choices:** Provide 3 or 4 new, distinct, and compelling choices (2-7 words). One choice must ALWAYS allow custom input.

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
