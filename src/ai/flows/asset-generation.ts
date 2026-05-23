
'use server';

/**
 * @fileOverview The Artisan - Multimedia Asset Generator.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  narrativeMoment: z.string().describe('A descriptive prompt of the milestone event to visualize.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image or a placeholder URL if generation fails.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    try {
      const {media} = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `Generate an image based on this description. The image should be in a dark, neo-noir, cinematic style with high contrast. It may have ethereal, glowing UI elements. It should have a persistent film grain effect. Description: ${input.narrativeMoment}`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (media?.url) {
        return {imageUrl: media.url};
      }
    } catch (error) {
      console.error('Image generation failed, using placeholder.', error);
    }
    
    // Fallback to a placeholder if generation fails or returns no URL
    return { imageUrl: "https://placehold.co/1280x720/100818/7DF9FF.png" };
  }
);
