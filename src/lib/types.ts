
import {GenerateNarrativeOutput} from '@/ai/flows/narrative-generation';
import {Choice} from './story';

export type TimelineEvent = {
  id: number;
  timestamp: string;
  choiceMade: string;
  generatedNarrative: GenerateNarrativeOutput;
  imageUrl: string;
  watcherCommentary: string;
  choices: Choice[];
};
