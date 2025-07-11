
import { Choice } from './story';

export type TimelineEvent = {
  id: number;
  timestamp: string;
  choiceMade: string;
  generatedNarrative: string;
  imageUrl: string;
  watcherCommentary: string;
  choices: Choice[];
};
