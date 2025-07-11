'use server';

/**
 * @fileOverview The Artisan - Multimedia Asset Generator.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  narrativeMoment: z.string().describe('A description of the key narrative moment to visualize.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageInputSchema},
  output: {schema: GenerateImageOutputSchema},
  prompt: `You are the Artisan, an AI that generates images based on narrative moments.

  Generate a single photorealistic image that captures the essence of the following narrative moment:
  {{{narrativeMoment}}}

  Ensure the image aligns with the Dark Neo-Noir meets Celestial Observatory visual style, using a dark, high-contrast color palette.
  Primary UI elements must be glowing and ethereal, using cyan for neutral/interactive elements and amber for critical information or Watcher commentary.
  Incorporate a subtle, persistent film grain post-processing effect.

  Return the image as a data URI.
  `,
});

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.narrativeMoment,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed: No image URL returned.');
    }

    return {imageUrl: media.url};
  }
);
