
export interface Choice {
  text: string;
}

// Note: The static story graph is no longer the primary driver of the narrative.
// The AI generates the story and choices dynamically.
// This file is kept for type definitions and potential future use with more structured scenarios.

export interface StoryNode {
  id: string;
  narrative: string;
  imagePrompt: string;
  choices: Choice[];
}

export interface StoryData {
  [key: string]: StoryNode;
}

export const story: StoryData = {
  start: {
    id: 'start',
    narrative: 'You stand at the temporal crossroads. A single thread of fate lies before you, ready to be rewoven.',
    imagePrompt: 'A shadowy figure standing before a swirling vortex of clocks and historical images, with a faint map of 1914 Europe visible. Dark neo-noir style with glowing cyan data streams.',
    choices: [],
  },
};
