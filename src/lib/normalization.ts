import type { Story } from './types';

/**
 * Normalizes language strings into a canonical representation:
 * 'Telugu', 'English', 'Hindi', etc.
 */
export function normalizeLanguage(lang?: string | null): string {
  if (!lang) return '';
  const trimmed = lang.trim().toLowerCase();
  if (trimmed === 'te' || trimmed === 'telugu' || trimmed === 'telugu stories' || trimmed === 'తెలుగు') {
    return 'Telugu';
  }
  if (trimmed === 'en' || trimmed === 'english' || trimmed === 'english stories') {
    return 'English';
  }
  if (trimmed === 'hi' || trimmed === 'hindi' || trimmed === 'hindi stories') {
    return 'Hindi';
  }
  // Capitalize first letter
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Checks whether a given language or story represents Telugu
 */
export function isTelugu(input?: any): boolean {
  if (!input) return false;
  if (typeof input === 'string') {
    const l = input.trim().toLowerCase();
    return l === 'telugu' || l === 'te' || l === 'తెలుగు' || l === 'telugu stories';
  }
  const lang = (input.language || '').toString().trim().toLowerCase();
  const code = (input.languageCode || '').toString().trim().toLowerCase();
  const genre = (input.genre || '').toString().trim().toLowerCase();
  const genreId = (input.genreId || '').toString().trim().toLowerCase();

  return (
    lang === 'telugu' ||
    lang === 'te' ||
    lang === 'తెలుగు' ||
    code === 'te' ||
    code === 'telugu' ||
    genre === 'telugu stories' ||
    genre === 'telugu' ||
    genreId === 'telugu'
  );
}

/**
 * Checks whether a given language or story represents English
 */
export function isEnglish(input?: any): boolean {
  if (!input) return false;
  if (typeof input === 'string') {
    const l = input.trim().toLowerCase();
    return l === 'english' || l === 'en' || l === 'english stories';
  }
  const lang = (input.language || '').toString().trim().toLowerCase();
  const code = (input.languageCode || '').toString().trim().toLowerCase();
  return lang === 'english' || lang === 'en' || code === 'en';
}

/**
 * Checks if a story's language matches a requested filter
 */
export function matchesLanguage(storyLang?: string | null, filterLang?: string | null): boolean {
  if (!filterLang || filterLang === 'All Languages' || filterLang.toLowerCase() === 'all') {
    return true;
  }
  if (!storyLang) return false;

  const sNorm = normalizeLanguage(storyLang).toLowerCase();
  const fNorm = normalizeLanguage(filterLang).toLowerCase();

  if (sNorm === fNorm) return true;
  if (storyLang.trim().toLowerCase() === filterLang.trim().toLowerCase()) return true;

  // Direct code match (e.g. 'te' matches 'Telugu')
  if (filterLang.trim().toLowerCase() === 'te' && isTelugu(storyLang)) return true;
  if (filterLang.trim().toLowerCase() === 'telugu' && isTelugu(storyLang)) return true;
  if (filterLang.trim().toLowerCase() === 'en' && isEnglish(storyLang)) return true;
  if (filterLang.trim().toLowerCase() === 'english' && isEnglish(storyLang)) return true;

  return false;
}

/**
 * Normalizes category slugs into canonical slugs:
 * 'novels', 'long-stories', 'short-stories', 'fun-stories', 'comedy-stories'
 */
export function normalizeCategorySlug(val?: string | null): string {
  if (!val) return '';
  const s = val.trim().toLowerCase().replace(/_/g, '-');

  if (
    s === 'novel' ||
    s === 'novels' ||
    s === 'novel-story' ||
    s === 'novel-stories' ||
    s === 'full-length-novels' ||
    s === 'full length novels'
  ) {
    return 'novels';
  }
  if (
    s === 'long' ||
    s === 'long-story' ||
    s === 'long-stories' ||
    s === 'long stories' ||
    s === 'long-reads' ||
    s === 'long reads'
  ) {
    return 'long-stories';
  }
  if (
    s === 'short' ||
    s === 'short-story' ||
    s === 'short-stories' ||
    s === 'short stories' ||
    s === 'quick-reads' ||
    s === 'quick reads'
  ) {
    return 'short-stories';
  }
  if (
    s === 'fun' ||
    s === 'fun-story' ||
    s === 'fun-stories' ||
    s === 'fun stories' ||
    s === 'lighthearted' ||
    s === 'lighthearted stories'
  ) {
    return 'fun-stories';
  }
  if (
    s === 'comedy' ||
    s === 'comedy-story' ||
    s === 'comedy-stories' ||
    s === 'comedy stories'
  ) {
    return 'comedy-stories';
  }

  return s;
}

/**
 * Check if a story is of type Novel
 */
export function isNovel(story: Story | any): boolean {
  if (!story) return false;
  const slugCat = normalizeCategorySlug(story.categorySlug);
  const nameCat = normalizeCategorySlug(story.categoryName);
  const rawCatSlug = normalizeCategorySlug(story.category?.slug);
  const rawCatName = normalizeCategorySlug(story.category?.name);

  return (
    slugCat === 'novels' ||
    nameCat === 'novels' ||
    rawCatSlug === 'novels' ||
    rawCatName === 'novels' ||
    story.categorySlug === 'novels' ||
    story.categorySlug === 'novel'
  );
}

/**
 * Check if a story is of type Long Story
 */
export function isLongStory(story: Story | any): boolean {
  if (!story) return false;
  const slugCat = normalizeCategorySlug(story.categorySlug);
  const nameCat = normalizeCategorySlug(story.categoryName);
  const rawCatSlug = normalizeCategorySlug(story.category?.slug);
  const rawCatName = normalizeCategorySlug(story.category?.name);

  return (
    slugCat === 'long-stories' ||
    nameCat === 'long-stories' ||
    rawCatSlug === 'long-stories' ||
    rawCatName === 'long-stories' ||
    story.categorySlug === 'long-stories' ||
    story.categorySlug === 'long-story'
  );
}

/**
 * Check if a story is of type Short Story
 */
export function isShortStory(story: Story | any): boolean {
  if (!story) return false;
  const slugCat = normalizeCategorySlug(story.categorySlug);
  const nameCat = normalizeCategorySlug(story.categoryName);
  const rawCatSlug = normalizeCategorySlug(story.category?.slug);
  const rawCatName = normalizeCategorySlug(story.category?.name);

  return (
    slugCat === 'short-stories' ||
    nameCat === 'short-stories' ||
    rawCatSlug === 'short-stories' ||
    rawCatName === 'short-stories' ||
    story.categorySlug === 'short-stories' ||
    story.categorySlug === 'short-story'
  );
}

/**
 * Check if a story is of type Fun Story
 */
export function isFunStory(story: Story | any): boolean {
  if (!story) return false;
  const slugCat = normalizeCategorySlug(story.categorySlug);
  const nameCat = normalizeCategorySlug(story.categoryName);
  const rawCatSlug = normalizeCategorySlug(story.category?.slug);
  const rawCatName = normalizeCategorySlug(story.category?.name);

  return (
    slugCat === 'fun-stories' ||
    nameCat === 'fun-stories' ||
    rawCatSlug === 'fun-stories' ||
    rawCatName === 'fun-stories' ||
    story.categorySlug === 'fun-stories' ||
    story.categorySlug === 'fun-story'
  );
}

/**
 * Check if a story is of type Comedy Story
 */
export function isComedyStory(story: Story | any): boolean {
  if (!story) return false;
  const slugCat = normalizeCategorySlug(story.categorySlug);
  const nameCat = normalizeCategorySlug(story.categoryName);
  const rawCatSlug = normalizeCategorySlug(story.category?.slug);
  const rawCatName = normalizeCategorySlug(story.category?.name);

  return (
    slugCat === 'comedy-stories' ||
    nameCat === 'comedy-stories' ||
    rawCatSlug === 'comedy-stories' ||
    rawCatName === 'comedy-stories' ||
    story.categorySlug === 'comedy-stories' ||
    story.categorySlug === 'comedy-story'
  );
}

/**
 * Generic check matching any category
 */
export function isStoryType(story: Story | any, targetType: string): boolean {
  const normTarget = normalizeCategorySlug(targetType);
  if (normTarget === 'novels') return isNovel(story);
  if (normTarget === 'long-stories') return isLongStory(story);
  if (normTarget === 'short-stories') return isShortStory(story);
  if (normTarget === 'fun-stories') return isFunStory(story);
  if (normTarget === 'comedy-stories') return isComedyStory(story);

  const slug = normalizeCategorySlug(story.categorySlug || story.category?.slug);
  const name = normalizeCategorySlug(story.categoryName || story.category?.name);
  return slug === normTarget || name === normTarget;
}

/**
 * Intelligent multi-token search matching title, author, genre, category, language, synopsis, tags.
 * e.g. "Telugu novels" matches a story where language is Telugu AND category is Novel.
 */
export function matchesSearch(story: Story | any, query: string): boolean {
  if (!query || !query.trim()) return true;

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  // Build searchable text corpus for the story
  const title = (story.title || '').toLowerCase();
  const author = (story.author || '').toLowerCase();
  const genre = (story.genre || '').toLowerCase();
  const categoryName = (story.categoryName || story.category?.name || '').toLowerCase();
  const categorySlug = (story.categorySlug || story.category?.slug || '').toLowerCase();
  const language = (story.language || story.language?.name || '').toLowerCase();
  const languageCode = (story.languageCode || story.language?.code || '').toLowerCase();
  const shortSynopsis = (story.shortDescription || story.short_synopsis || '').toLowerCase();
  const fullSynopsis = (story.fullDescription || story.full_synopsis || '').toLowerCase();
  const tags = (story.tags || []).map((t: string) => t.toLowerCase()).join(' ');

  const searchableText = `${title} ${author} ${genre} ${categoryName} ${categorySlug} ${language} ${languageCode} ${shortSynopsis} ${fullSynopsis} ${tags}`;

  // Every token must match somewhere
  return tokens.every(token => {
    // Check direct substring
    if (searchableText.includes(token)) return true;

    // Special token mappings
    if ((token === 'telugu' || token === 'te') && isTelugu(story)) return true;
    if ((token === 'english' || token === 'en') && isEnglish(story)) return true;
    if ((token === 'novel' || token === 'novels') && isNovel(story)) return true;
    if ((token === 'long' || token === 'long-story' || token === 'long-stories') && isLongStory(story)) return true;
    if ((token === 'short' || token === 'short-story' || token === 'short-stories') && isShortStory(story)) return true;
    if ((token === 'fun' || token === 'fun-story' || token === 'fun-stories') && isFunStory(story)) return true;
    if ((token === 'comedy' || token === 'comedy-story' || token === 'comedy-stories') && isComedyStory(story)) return true;

    return false;
  });
}
