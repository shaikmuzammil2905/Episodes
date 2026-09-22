import { Story, Author, Genre, Episode } from './types';

export const GENRES: Genre[] = [
  { id: 'fantasy', name: 'Fantasy', slug: 'fantasy', description: 'Realm of magic, ancient legends, and mythic beasts.', iconName: 'Sparkles', count: 12 },
  { id: 'romance', name: 'Romance', slug: 'romance', description: 'Tales of passion, heartfelt connection, and fateful love.', iconName: 'Heart', count: 15 },
  { id: 'mystery', name: 'Mystery', slug: 'mystery', description: 'Intriguing puzzles, hidden clues, and unsolved secrets.', iconName: 'Compass', count: 9 },
  { id: 'thriller', name: 'Thriller', slug: 'thriller', description: 'Pulse-pounding suspense, high stakes, and sudden turns.', iconName: 'Zap', count: 11 },
  { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi', description: 'Futuristic technology, space exploration, and AI evolution.', iconName: 'Cpu', count: 8 },
  { id: 'horror', name: 'Horror', slug: 'horror', description: 'Chilling shadows, haunting folklore, and terror.', iconName: 'Ghost', count: 7 },
  { id: 'adventure', name: 'Adventure', slug: 'adventure', description: 'Daring expeditions, uncharted lands, and heroic quests.', iconName: 'Map', count: 14 },
  { id: 'drama', name: 'Drama', slug: 'drama', description: 'Deep human emotions, family sagas, and life choices.', iconName: 'BookOpen', count: 10 },
  { id: 'english', name: 'English Stories', slug: 'english', description: 'Engaging fiction written in English.', iconName: 'Globe', count: 20 },
  { id: 'telugu', name: 'Telugu Stories', slug: 'telugu', description: 'Rich cultural narratives written in Telugu (తెలుగు కథలు).', iconName: 'Feather', count: 18 },
  { id: 'short-stories', name: 'Short Stories', slug: 'short-stories', description: 'Quick, impactful reads to finish in a single session.', iconName: 'Clock', count: 25 },
];

export const AUTHORS: Author[] = [
  {
    id: 'author-vikram',
    name: 'Vikram Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Bestselling dark mystery and supernatural thriller writer.',
    storyCount: 4
  },
  {
    id: 'author-ananya',
    name: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Fantasy world-builder and epic adventure storyteller.',
    storyCount: 5
  },
  {
    id: 'author-ramesh',
    name: 'Ramesh Babu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Telugu literary writer crafting emotional family dramas and mystery stories.',
    storyCount: 6
  }
];

export const STORIES: Story[] = [
  {
    id: 'secret-old-house',
    slug: 'secret-old-house',
    title: 'The Secret of the Old House',
    author: 'Vikram Sharma',
    authorId: 'author-vikram',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    genre: 'Mystery',
    genreId: 'mystery',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'An inherited ancestral manor hides a locked room that was never meant to be opened.',
    fullDescription: 'When Ethan inherited Oakridge Manor, he expected creaky floorboards and dust. What he discovered instead was a forgotten room secured by three copper locks, a century-old diary warning against nocturnal noises, and a stranger who appears only at dusk. As Ethan uncovers the house\'s dark history, he realizes that some family secrets refuse to stay buried.',
    status: 'Ongoing',
    isPremium: false,
    tags: ['Haunted Manor', 'Family Secrets', 'Dark Mystery', 'Investigation'],
    readingTime: '25 min total',
    whyRead: 'Perfect for fans of Gothic mystery and atmospheric slow-burn suspense with surprising twists at the end of every episode.',
    featured: true,
    recommended: true,
    episodes: [
      {
        id: 'episode-1',
        storyId: 'secret-old-house',
        episodeNumber: 1,
        title: 'The Mysterious Letter',
        summary: 'Ethan receives an official envelope sealed with black wax, summoning him to Oakridge Manor.',
        readingTime: '5 min',
        publishedAt: '2026-09-01',
        content: `The rainfall in Blackwood Valley had a heavy, rhythmic cadence that felt almost intentional. Inside the dimly lit attorney’s office, Mr. Vance pushed a heavy manila folder across the mahogany desk.

"Your grand-uncle’s estate is straightforward, Ethan," Vance said, adjusting his wire-rimmed glasses. "Except for one condition. Oakridge Manor passes to you entirely, provided you reside there for at least thirty consecutive days before deciding whether to keep or sell it."

Ethan picked up the key tied with yellowed cord. Attached to it was a folded parchment sealed in black wax.

"What is this?" Ethan asked.

"A personal note from Grand-Uncle Alistair. He insisted you read it only upon stepping inside the foyer."

Three hours later, Ethan stood before the iron gates of Oakridge Manor. The house loomed against the dusk sky like a sleeping monolith, its high gables cutting into the fog. Opening the heavy oak front door, the smell of aged paper and lavender rushed out to meet him.

He unsealed the letter under the chandelier’s dim flicker:

*To Ethan,*
*If you are reading this, I am gone, and the house has chosen its new steward. Do not unlock the room on the third floor east wing. No matter what sounds whisper through the keyhole after midnight, keep the copper padlock fast.*

*With grave earnestness,*
*Alistair.*`
      },
      {
        id: 'episode-2',
        storyId: 'secret-old-house',
        episodeNumber: 2,
        title: 'The Locked Room',
        summary: 'Despite the warning, footsteps above Ethan’s bedroom force him to inspect the third floor.',
        readingTime: '6 min',
        publishedAt: '2026-09-05',
        content: `It was 2:14 AM when the sound began. Not a creak of settling wood, but distinct, rhythmic footsteps walking back and forth directly above Ethan’s bed.

Ethan sat up, his heart hammering against his ribs. He grabbed a heavy metal flashlight from his nightstand and pushed his door open into the dark hallway.

The staircase to the third floor smelled colder, damp like an underground cellar. At the end of the east corridor stood a solid mahogany door reinforced with three heavy copper locks.

He shone the beam at the floor before the threshold. Fresh dust prints—small, narrow shoe marks—led up to the door and vanished under the frame.

"Hello?" Ethan called out.

The footsteps inside instantly stopped. Silence pressed against his ears like deep water. Then, from behind the door, came a soft metallic clicking, as if someone inside was trying keys in a lock.`
      },
      {
        id: 'episode-3',
        storyId: 'secret-old-house',
        episodeNumber: 3,
        title: 'The Stranger at Dusk',
        summary: 'Ethan meets an enigmatic woman near the estate cemetery who knows more than she lets on.',
        readingTime: '7 min',
        publishedAt: '2026-09-10',
        content: `Morning brought thick mist across the estate lawn. Ethan decided to survey the grounds to clear his head after a sleepless night.

Behind the overgrown hedge garden, he stumbled upon an old stone mausoleum clad in Ivy. Standing near the iron gate was a young woman wrapped in a dark blue coat, holding a brass pocket watch.

"You shouldn't be wandering without a lantern after 5 PM," she said without turning around. Her voice was crisp and unhurried.

"I live here now. I'm Ethan," he replied. "Who are you?"

She turned, revealing calm grey eyes. "My name is Clara. I was Alistair’s assistant during his last years. He warned me you would come."

"Did he tell you about the third-floor room?"

Clara's expression tightened. "He told me never to let anyone open it. Because what's inside didn't start in this century—and it isn't waiting to escape. It's waiting for you to enter."`
      }
    ]
  },
  {
    id: 'wings-of-tomorrow',
    slug: 'wings-of-tomorrow',
    title: 'Wings of Tomorrow',
    author: 'Ananya Roy',
    authorId: 'author-ananya',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    genre: 'Fantasy',
    genreId: 'fantasy',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'A young mechanic discovers a mechanical dragon core in a sky citadel where flying is forbidden.',
    fullDescription: 'In the floating cloud-city of Aethelgard, sky-sailing has been outlawed for fifty years under the strict decree of the High Council. Lyra, an orphaned clockwork mechanic, survives by fixing banned sky-gears in secret. When an ancient dragon-core awakens inside her workshop, she is drawn into a rebellion that could restore freedom to the skies.',
    status: 'Ongoing',
    isPremium: false,
    tags: ['Steampunk', 'Floating City', 'Magic & Technology', 'Epic Adventure'],
    readingTime: '30 min total',
    whyRead: 'A breathtaking fantasy saga rich with world-building, high-flying action, and endearing heroics.',
    featured: true,
    recommended: false,
    episodes: [
      {
        id: 'episode-1',
        storyId: 'wings-of-tomorrow',
        episodeNumber: 1,
        title: 'The Spark in the Workshop',
        summary: 'Lyra uncovers a pulsing bronze orb buried under scrap iron in her subterranean smithy.',
        readingTime: '6 min',
        publishedAt: '2026-09-02',
        content: `The sky above Aethelgard bled gold and violet as the cloud-ships of the Enforcers passed overhead. Below in Sector 9, Lyra wiped grease from her cheek with her sleeve.

Her small basement workshop smelled of copper wire, oil, and ozone. On her workbench lay a metallic sphere she had bought off a scrap collector that afternoon.

"Just junk," her assistant Kip muttered, chewing on dried fruit.

"No," Lyra whispered. She picked up her finest glass magnifier. "Look at the engraving. It isn't brass. It’s Celestial Steel."

She touched a brass needle to the sphere’s central seam. A soft humming reverberated through the workbench. Blue light flared from within, projecting a spinning map of the skyways onto the dusty ceiling.`
      },
      {
        id: 'episode-2',
        storyId: 'wings-of-tomorrow',
        episodeNumber: 2,
        title: 'Flight of the Skyship',
        summary: 'With the Enforcers closing in, Lyra powers an old glider using the mysterious dragon core.',
        readingTime: '7 min',
        publishedAt: '2026-09-08',
        content: `Sirens wailed across Sector 9. Heavy boots thundered down the iron stairs leading to the workshop.

"Enforcers! Open in the name of the High Council!" a harsh voice bellowed.

"Kip, get the glider harness!" Lyra shouted. She slotted the glowing core into the chest plate of a rusted wing-rig mounted near the trapdoor.

The metal wings burst open with a glorious clatter of gears, feathering out six feet wide with shimmering blue energy ribbons.

Lyra strapped into the harness, grabbed Kip by the belt, and hit the release valve right as the workshop door exploded inward. Together, they leapt into the open cloud abyss.`
      }
    ]
  },
  {
    id: 'anaganaga-oka-aranyam',
    slug: 'anaganaga-oka-aranyam',
    title: 'అనగనగా ఒక అరణ్యం (Once Upon a Forest)',
    author: 'Ramesh Babu',
    authorId: 'author-ramesh',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    genre: 'Telugu Stories',
    genreId: 'telugu',
    language: 'Telugu',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'అడవి నడిబొడ్డున ఉన్న ఒక ప్రాచీన గ్రామంలో జరిగే వింత సంఘటనల కథ.',
    fullDescription: 'నల్లమల అడవుల అంచున ఉన్న కొండపల్లి గ్రామంలో రాము అనే యువకుడు తన తాతగారి పాత పొలంలో ఒక రాగి పేటికను కనుగొంటాడు. ఆ పేటికలో ఉన్న మంత్ర అక్షరాలు గ్రామానికి కాపలాగా ఉన్న దేవత రహస్యాన్ని వెల్లడిస్తాయి.',
    status: 'Ongoing',
    isPremium: false,
    tags: ['Telugu Fiction', 'Village Mystery', 'Ancient Myths', 'Folklore'],
    readingTime: '20 min total',
    whyRead: 'తెలుగు సంస్కృతి, గ్రామ జీవనం మరియు మంత్ర ముగ్ధులను చేసే అద్భుతమైన కథనం.',
    featured: true,
    recommended: true,
    episodes: [
      {
        id: 'episode-1',
        storyId: 'anaganaga-oka-aranyam',
        episodeNumber: 1,
        title: 'ఎపిసోడ్ 1 — పొలంలో దొరికిన పెట్టె',
        summary: 'రాముకి తన తాతగారి పాత పొలంలో త్రవ్వకాలలో ఒక రాగి పెట్టె లభిస్తుంది.',
        readingTime: '5 min',
        publishedAt: '2026-09-03',
        content: `కొండపల్లి గ్రామంలో ఆ సాయంత్రం సూర్యుడు ఎర్రగా అస్తమిస్తున్నాడు. రాము తన తాతగారి పాత పొలంలో నీటి పారుదల కోసం కాలువ తవ్వుతున్నాడు.

అకస్మాత్తుగా అతని పార ఒక గట్టి వస్తువుకి తగిలి పెద్ద శబ్దం వచ్చింది. మట్టిని పక్కకి జరిపి చూస్తే, ఒక ప్రాచీన రాగి పెట్టె కనిపించింది. దానిపైన వింత ముద్రలు చెక్కబడి ఉన్నాయి.

రాము ఆ పెట్టెను ఇంటికి తీసుకువచ్చి తన తాతగారికి చూపించాడు. పెట్టెను చూసిన తాతగారి ముఖంలో భయం కొట్టొచ్చినట్లు కనిపించింది.

"రాము... ఇది సామాన్యమైన పెట్టె కాదు. మన గ్రామాన్ని వంద ఏళ్ల క్రితం కాపాడిన శ్రీశైలం సిద్ధుల ముద్ర ఇది!" అని తాతగారు హెచ్చరించారు.`
      },
      {
        id: 'episode-2',
        storyId: 'anaganaga-oka-aranyam',
        episodeNumber: 2,
        title: 'ఎపిసోడ్ 2 — సిద్ధుల రహస్యం',
        summary: 'తాతగారు రాగి పెట్టె వెనుక ఉన్న 100 ఏళ్ల నాటి గ్రామీణ రహస్యాన్ని వెల్లడిస్తారు.',
        readingTime: '6 min',
        publishedAt: '2026-09-09',
        content: `పెట్టెపై ఉన్న రాగి లాక్‌ను తెరిచేసరికి, లోపల ఒక పాత తాళపత్ర గ్రంథం మరియు పచ్చని స్పటిక రాయి బయటపడ్డాయి.

తాతగారు దీపం వెలుగులో ఆ తాళపత్రాలను చదవడం ప్రారంభించారు.

"మన కొండపల్లి అడవిలో ఒక రహస్య గుహ ఉంది. అక్కడ ప్రతి పౌర్ణమి రాత్రి ఒక కాంతి వెలుగుతుంది. ఆ కాంతి గ్రామానికి రక్షణ కల్పిస్తుంది. కానీ ఆ రాయి అక్కడ పునఃప్రతిష్ఠించకపోతే, అడవిలోని చీకటి శక్తులు గ్రామాన్ని చుట్టుముడతాయి..."`
      }
    ]
  },
  {
    id: 'the-last-coffee-at-midnight',
    slug: 'the-last-coffee-at-midnight',
    title: 'The Last Coffee at Midnight',
    author: 'Vikram Sharma',
    authorId: 'author-vikram',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    genre: 'Short Stories',
    genreId: 'short-stories',
    language: 'Short Story',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'A 24-hour diner at the edge of the highway receives a stranger who orders a drink for yesterday.',
    fullDescription: 'At midnight on Highway 44, Arthur keeps the coffee pot warm for long-distance truckers. Tonight, a traveler in a vintage trench coat steps in, paying with a silver coin minted in 1942 and asking for news about a train that derailed fifty years ago.',
    status: 'Completed',
    isPremium: false,
    tags: ['Short Read', 'Time Travel', 'Urban Fantasy', 'Atmospheric'],
    readingTime: '8 min total',
    whyRead: 'A poignant single-episode masterpiece ideal for quick late-night reading.',
    featured: false,
    recommended: true,
    episodes: [
      {
        id: 'episode-1',
        storyId: 'the-last-coffee-at-midnight',
        episodeNumber: 1,
        title: 'Single Episode — The Midnight Diner',
        summary: 'Arthur serves a cup of coffee to a traveler who seems to belong to another era.',
        readingTime: '8 min',
        publishedAt: '2026-09-04',
        content: `The neon sign outside flickered faintly: *LUNA DINER - OPEN 24 HOURS*.

Arthur wiped down the chrome counter with a damp rag. Rain slammed against the panoramic glass windows. It was 11:58 PM.

The bell above the heavy door chimed. A tall man in a dark grey trench coat walked in, shaking rainwater off his hat. He chose the corner booth overlooking the empty highway.

Arthur walked over with a glass of ice water and a menu. "Night is rough out there, sir. Coffee?"

"Black, please," the stranger said. His voice was smooth, carrying a strange antique cadence. He placed a silver half-dollar coin on the table.

Arthur picked up the coin. It was heavy, cool to the touch, and stamped *1942*.

"Is the midnight express from Denver still on schedule?" the man asked quietly, looking at his gold pocket watch.

Arthur paused. "Sir... the Denver railway line was converted into a hiking trail thirty years ago."

The stranger smiled softly, taking a sip of the steaming dark roast. "Ah. Then it seems I have arrived a bit too late... or perhaps just in time."`
      }
    ]
  }
];

// Helper Data Access Functions
export function getStories(): Story[] {
  return STORIES;
}

export function getStoryById(id: string): Story | undefined {
  if (!id) return undefined;
  return STORIES.find((s) => s.id.toLowerCase() === id.toLowerCase() || s.slug.toLowerCase() === id.toLowerCase());
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getStoryById(slug);
}

export function getEpisodesByStory(storyId: string): Episode[] {
  const story = getStoryById(storyId);
  return story ? story.episodes : [];
}

export function getEpisodeById(storyId: string, episodeId: string): { story: Story; episode: Episode } | undefined {
  const story = getStoryById(storyId);
  if (!story) return undefined;
  const episode = story.episodes.find((e) => e.id.toLowerCase() === episodeId.toLowerCase());
  if (!episode) return undefined;
  return { story, episode };
}

export function getStoriesByGenre(genreId: string): Story[] {
  if (!genreId) return STORIES;
  return STORIES.filter(
    (s) => s.genreId.toLowerCase() === genreId.toLowerCase() || s.language.toLowerCase() === genreId.toLowerCase()
  );
}

export function getStoriesByAuthor(authorId: string): Story[] {
  return STORIES.filter((s) => s.authorId.toLowerCase() === authorId.toLowerCase());
}

export function getRelatedStories(storyId: string, limit: number = 3): Story[] {
  const current = getStoryById(storyId);
  if (!current) return STORIES.slice(0, limit);
  return STORIES.filter((s) => s.id !== current.id && (s.genreId === current.genreId || s.language === current.language)).slice(0, limit);
}

export function searchStories(query: string): Story[] {
  if (!query || query.trim() === '') return STORIES;
  const q = query.toLowerCase();
  return STORIES.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
}
