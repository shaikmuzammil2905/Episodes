const fs = require('fs');

function updatePage(path, categorySlugPrefix) {
  let c = fs.readFileSync(path, 'utf8');
  const regex = /stories = \(dbStories \|\| \[\]\)\.filter\(s =>[\s\S]*?\);/g;
  
  c = c.replace(regex, `stories = (dbStories || []).filter(s => s.categorySlug === '${categorySlugPrefix}-story' || s.categorySlug === '${categorySlugPrefix}-stories' || s.categorySlug === '${categorySlugPrefix}');`);
  
  fs.writeFileSync(path, c);
}

updatePage('src/app/(public)/long-stories/page.tsx', 'long');
updatePage('src/app/(public)/short-stories/page.tsx', 'short');
updatePage('src/app/(public)/novels/page.tsx', 'novel');
updatePage('src/app/(public)/fun-stories/page.tsx', 'fun');
updatePage('src/app/(public)/comedy-stories/page.tsx', 'comedy');

let home = fs.readFileSync('src/app/(public)/HomePageClient.tsx', 'utf8');

home = home.replace(
  /const longStories = filteredStories\.filter\(s =>[^;]+\);/g,
  `const longStories = filteredStories.filter(s => s.categorySlug === 'long-story' || s.categorySlug === 'long-stories' || s.categorySlug === 'long');`
);
home = home.replace(
  /const shortStories = filteredStories\.filter\(s =>[^;]+\);/g,
  `const shortStories = filteredStories.filter(s => s.categorySlug === 'short-story' || s.categorySlug === 'short-stories' || s.categorySlug === 'short');`
);
home = home.replace(
  /const novels = filteredStories\.filter\(s =>[^;]+\);/g,
  `const novels = filteredStories.filter(s => s.categorySlug === 'novel' || s.categorySlug === 'novels');`
);
home = home.replace(
  /const funStories = filteredStories\.filter\(s =>[^;]+\);/g,
  `const funStories = filteredStories.filter(s => s.categorySlug === 'fun-story' || s.categorySlug === 'fun-stories' || s.categorySlug === 'fun');`
);
home = home.replace(
  /const comedyStories = filteredStories\.filter\(s =>[^;]+\);/g,
  `const comedyStories = filteredStories.filter(s => s.categorySlug === 'comedy-story' || s.categorySlug === 'comedy-stories' || s.categorySlug === 'comedy');`
);

fs.writeFileSync('src/app/(public)/HomePageClient.tsx', home);
