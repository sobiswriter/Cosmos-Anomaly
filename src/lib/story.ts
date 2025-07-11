export interface Choice {
  text: string;
  nextNodeId: string;
}

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
    narrative: 'You stand at the temporal crossroads. A single thread of fate lies before you, ready to be rewoven. The year is 1914. Archduke Franz Ferdinand is about to visit Sarajevo. The spark that could ignite a world war. Your first choice is critical.',
    imagePrompt: 'A shadowy figure standing before a swirling vortex of clocks and historical images, with a faint map of 1914 Europe visible. Dark neo-noir style with glowing cyan data streams.',
    choices: [
      { text: 'Prevent the assassination.', nextNodeId: 'prevent' },
      { text: 'Ensure the assassination succeeds.', nextNodeId: 'ensure' },
      { text: 'Observe without interference.', nextNodeId: 'observe' },
    ],
  },
  prevent: {
    id: 'prevent',
    narrative: 'A world war is averted, but the fragile peace of Europe is built on a foundation of simmering tensions. A new, colder conflict begins to emerge between the great powers.',
    imagePrompt: 'A 1920s European city street scene under an unnaturally calm, tense sky. People in period clothing look anxious. Neo-noir style, high contrast, shadows.',
    choices: [
        { text: "Foster global cooperation.", nextNodeId: "cooperation" },
        { text: "Incite a different conflict.", nextNodeId: "new_war" },
    ],
  },
  ensure: {
    id: 'ensure',
    narrative: 'The Great War unfolds as history recorded, but your influence has subtly amplified its brutality. The aftermath is a world more broken, more desperate for a savior... or a tyrant.',
    imagePrompt: 'A desolate, muddy battlefield of World War I, with eerie, glowing cyan flora starting to grow on the ruins of a church. Dark, high contrast, cinematic.',
    choices: [
        { text: "Guide humanity towards reconstruction.", nextNodeId: "reconstruction" },
        { text: "Support the rise of a dictator.", nextNodeId: "dictator" },
    ],
  },
  observe: {
    id: 'observe',
    narrative: 'You watch as history follows its known path. The war, the loss, the treaty. But your presence is not unfelt. A ripple of awareness spreads through the timeline, a sense of being watched.',
    imagePrompt: 'A smoky, dimly lit room in Versailles during the treaty signing. The faces of the world leaders are obscured by shadow, with one figure looking directly out, as if at the viewer. Ethereal glow.',
    choices: [
        { text: "Reveal your presence.", nextNodeId: "reveal" },
        { text: "Remain a ghost in time.", nextNodeId: "ghost" },
    ],
  },
  cooperation: { 
    id: 'cooperation', 
    narrative: 'Through careful manipulation, a global alliance forms, maintaining a precarious peace. The world is stable, but innovation stagnates under the weight of bureaucracy. A golden cage.', 
    imagePrompt: 'Futuristic city with retro-1930s art-deco architecture, eerily clean and orderly. United under a single glowing cyan banner. A sense of sterile perfection.', 
    choices: [] 
  },
  new_war: { 
    id: 'new_war', 
    narrative: 'A new, more technologically devastating war erupts in the 1930s, fought with strange energies and advanced machines. History has been torn asunder.', 
    imagePrompt: 'Art deco-style war machines powered by glowing amber cores clashing under a blood-red sky over a ruined city.', 
    choices: [] 
  },
  reconstruction: { 
    id: 'reconstruction', 
    narrative: 'Humanity slowly rebuilds, scarred but united by the immense loss. A new age of art and science is born from the ashes, tinged with melancholy.', 
    imagePrompt: 'A field of glowing amber flowers growing over a rusted, broken down tank from WWI. A single child is placing a flower on the tank. Hopeful but somber.', 
    choices: [] 
  },
  dictator: { 
    id: 'dictator', 
    narrative: 'A global tyrant rises from the chaos, promising order at the cost of freedom. Their reign is absolute, enforced by technology born from the war\'s horrors.', 
    imagePrompt: 'A colossal, obsidian statue of a faceless, hooded dictator looming over a futuristic, oppressed city. The only light comes from amber surveillance drones.', 
    choices: [] 
  },
  reveal: { 
    id: 'reveal', 
    narrative: 'The world is thrown into chaos as knowledge of your existence shatters their reality. Religions collapse, nations panic, and a new dark age of superstition and fear begins.', 
    imagePrompt: 'A panicked crowd in a 1920s city square looking up at a celestial, geometric anomaly in the sky that looks like a giant eye.', 
    choices: [] 
  },
  ghost: { 
    id: 'ghost', 
    narrative: 'You continue to watch, a silent guardian of a history you can no longer truly call your own. The echoes of your choices fade, and you are left alone with what you have made.', 
    imagePrompt: 'An empty, ethereal clock tower made of light overlooking a bustling, unaware city that blurs and shifts through different time periods.', 
    choices: [] 
  },
};
