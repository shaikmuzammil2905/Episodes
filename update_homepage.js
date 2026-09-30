const fs = require('fs');

let code = fs.readFileSync('src/app/(public)/HomePageClient.tsx', 'utf-8');

// Replace the compact nav
code = code.replace(/\{?\/\* ──── COMPACT STORY NAVIGATION ──── \*\/\}?[\s\S]*?<\/nav>/, '');

// The filtered stories logic needs to be updated. We just filter by language, then we make arrays for each category.
const replacementLogic = `
  const filteredStories = useMemo(() => {
    let result = stories;
    if (selectedLanguage && selectedLanguage !== 'All Languages') {
      result = result.filter(s => s.language?.toLowerCase() === selectedLanguage.toLowerCase());
    }
    return result;
  }, [selectedLanguage, stories]);

  const popularStories = filteredStories.filter(s => s.featured);
  const trendingStories = filteredStories.filter(s => s.recommended || s.trending);
  const latestStories = [...filteredStories].reverse().slice(0, 8);

  const longStories = filteredStories.filter(s => parseInt(s.readingTime || '0') > 20 || s.episodes?.length > 2 || s.genre?.toLowerCase() === 'long stories' || s.genreId?.toLowerCase() === 'long-stories');
  const shortStories = filteredStories.filter(s => s.genre?.toLowerCase().includes('short') || s.genreId?.toLowerCase().includes('short') || s.tags?.includes('Short Read'));
  const novels = filteredStories.filter(s => s.genre?.toLowerCase() === 'novels' || s.genreId?.toLowerCase() === 'novels' || s.genre?.toLowerCase() === 'novel');
  const funStories = filteredStories.filter(s => s.genre?.toLowerCase() === 'fun stories' || s.genreId?.toLowerCase() === 'fun-stories' || s.tags?.includes('Fun'));
  const comedyStories = filteredStories.filter(s => s.genre?.toLowerCase() === 'comedy stories' || s.genreId?.toLowerCase() === 'comedy-stories' || s.genre?.toLowerCase() === 'comedy' || s.genreId?.toLowerCase() === 'comedy');
`;

code = code.replace(/const filteredStories = useMemo\(\(\) => \{[\s\S]*?const latestStories = \[\.\.\.filteredStories\]\.reverse\(\)\.slice\(0, 4\);/, replacementLogic);

const sectionCSS = `
        /* Horizontal Scroll Carousel */
        .carousel-container {
          position: relative;
          width: 100%;
        }
        .stories-carousel {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 16px;
          scrollbar-width: thin;
        }
        .stories-carousel > * {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .stories-carousel > * { flex: 0 0 300px; }
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .view-all-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--royal-blue);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .view-all-link:hover { text-decoration: underline; }
`;

code = code.replace(/const \[selectedCategory, setSelectedCategory\] = useState<string>\(categoryNames\[0\] \|\| 'Novels'\);/, '');
code = code.replace(/selectedCategory, /g, '');

const linkImport = "import Link from 'next/link';\n";
if (!code.includes("import Link")) {
  code = code.replace("import React", linkImport + "import React");
}

code = code.replace(/\/\* ── Stories Grid ── \*\/[\s\S]*?\.empty-state \{/, sectionCSS + '\n        .empty-state {');

const renderSection = (title, items, viewAllLink) => `
      {/* ──── ${title.toUpperCase()} ──── */}
      <section className="section bg-main">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">{t('${title}')}</h2>
            ${viewAllLink ? \`<Link href="\${viewAllLink}" className="view-all-link">View All &rarr;</Link>\` : ''}
          </div>
          {${items}.length > 0 ? (
            <div className="carousel-container">
              <div className="stories-carousel">
                {${items}.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">{t('No ${title.toLowerCase()} found for this filter.')}</div>
          )}
        </div>
      </section>
`;

const newSections = `
      ${renderSection('Popular Stories', 'popularStories')}
      ${renderSection('Trending Stories', 'trendingStories')}
      ${renderSection('Latest Stories', 'latestStories')}
      ${renderSection('Long Stories', 'longStories', '/long-stories')}
      ${renderSection('Short Stories', 'shortStories', '/short-stories')}
      ${renderSection('Novels', 'novels', '/novels')}
      ${renderSection('Fun Stories', 'funStories', '/fun-stories')}
      ${renderSection('Comedy Stories', 'comedyStories', '/comedy-stories')}
`;

code = code.replace(/\{\/\* ──── POPULAR NOVELS ──── \*\/\}[\s\S]*?\{\/\* ──── COMPACT GENRES \(ADDITIONAL DISCOVERY\) ──── \*\/\}/, newSections + '\n      {/* ──── COMPACT GENRES (ADDITIONAL DISCOVERY) ──── */}');
// Also remove old translations if needed or leave them.

fs.writeFileSync('src/app/(public)/HomePageClient.tsx', code);
