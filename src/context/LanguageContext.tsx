'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Translations = Record<string, string>;

const en: Translations = {
  home: "Home",
  stories: "Stories",
  genres: "Genres",
  authors: "Authors",
  about: "About",
  search: "Search",
  popularNovels: "Popular Novels",
  trendingStories: "Trending Stories",
  latestStories: "Latest Novel Chapters & Stories",
  readNow: "Read Now",
  explore: "Explore",
  allLanguages: "All Languages",
  language: "Language",
  noStories: "No stories are available in this language yet.",
  viewAllLanguages: "View All Languages",
  by: "By",
  premium: "Premium",
  free: "Free",
  episodes: "Episodes",
  episode: "Episode",
  howItWorks: "How It Works",
  contact: "Contact",
  futurePremium: "Future Premium",
  chatOnWhatsApp: "Chat on WhatsApp",
  callUs: "Call Us",
  discoverAmazingStories: "Discover Amazing Stories,",
  oneEpisodeAtATime: "One Episode at a Time",
  heroSub: "Explore captivating stories, discover new worlds, and keep coming back for the next episode.",
  searchPlaceholder: "Search stories, authors, genres...",
  browseGenres: "Browse Genres",
  discoverByGenre: "Discover by Genre",
  continueReading: "Continue Reading",
  relatedStories: "Related Stories",
  novels: "Novels",
  longStories: "Long Stories",
  shortStories: "Short Stories",
  funStories: "Fun Stories"
};

const te: Translations = {
  home: "హోమ్",
  stories: "కథలు",
  genres: "వర్గాలు",
  authors: "రచయితలు",
  about: "గురించి",
  search: "శోధించండి",
  popularNovels: "ప్రముఖ నవలలు",
  trendingStories: "ట్రెండింగ్ కథలు",
  latestStories: "తాజా నవల అధ్యాయాలు మరియు కథలు",
  readNow: "ఇప్పుడే చదవండి",
  explore: "అన్వేషించండి",
  allLanguages: "అన్ని భాషలు",
  language: "భాష",
  noStories: "ఈ భాషలో ఇంకా కథలు అందుబాటులో లేవు.",
  viewAllLanguages: "అన్ని భాషలను చూడండి",
  by: "రచన",
  premium: "ప్రీమియం",
  free: "ఉచితం",
  episodes: "అధ్యాయాలు",
  episode: "అధ్యాయం",
  howItWorks: "ఎలా పనిచేస్తుంది",
  contact: "సంప్రదించండి",
  futurePremium: "ఫ్యూచర్ ప్రీమియం",
  chatOnWhatsApp: "వాట్సాప్‌లో చాట్ చేయండి",
  callUs: "మాకు కాల్ చేయండి",
  discoverAmazingStories: "అద్భుతమైన కథలను కనుగొనండి,",
  oneEpisodeAtATime: "ఒకేసారి ఒక అధ్యాయం",
  heroSub: "ఆకర్షణీయమైన కథలను అన్వేషించండి మరియు తదుపరి అధ్యాయం కోసం తిరిగి రండి.",
  searchPlaceholder: "కథలు, రచయితలు, వర్గాలను వెతకండి...",
  browseGenres: "వర్గాలను బ్రౌజ్ చేయండి",
  discoverByGenre: "వర్గం ద్వారా అన్వేషించండి",
  continueReading: "చదవడం కొనసాగించండి",
  relatedStories: "సంబంధిత కథలు",
  novels: "నవలలు",
  longStories: "పెద్ద కథలు",
  shortStories: "చిన్న కథలు",
  funStories: "సరదా కథలు"
};

const dictionaries: Record<string, Translations> = {
  en,
  te
};

interface LanguageContextType {
  selectedLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('All Languages');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('storyepisodes_language');
      if (stored) {
        setSelectedLanguageState(stored);
      }
    } catch (e) {
      // safe fallback if localStorage is unavailable
    }
  }, []);

  const setLanguage = (lang: string) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem('storyepisodes_language', lang);
    } catch (e) {}
  };

  const t = (key: string): string => {
    // If All Languages or English is selected, use 'en'. 
    // If Telugu is selected, use 'te'. Otherwise fallback to 'en'.
    const dictKey = selectedLanguage === 'Telugu' ? 'te' : 'en';
    const dictionary = dictionaries[dictKey] || dictionaries.en;
    
    return dictionary[key] || en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
