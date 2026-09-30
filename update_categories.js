const fs = require('fs');

const pages = [
  { path: 'src/app/(public)/long-stories/page.tsx', title: 'Long Stories', desc: 'Dive into our extensive collection of long stories and epic novels.' },
  { path: 'src/app/(public)/short-stories/page.tsx', title: 'Short Stories', desc: 'Quick reads perfect for a coffee break or commute.' },
  { path: 'src/app/(public)/novels/page.tsx', title: 'Novels', desc: 'Discover full-length novels across all genres.' },
  { path: 'src/app/(public)/fun-stories/page.tsx', title: 'Fun Stories', desc: 'Lighthearted, entertaining, and fun stories to brighten your day.' },
  { path: 'src/app/(public)/comedy-stories/page.tsx', title: 'Comedy Stories', desc: 'Laugh out loud with our collection of comedy stories.' }
];

pages.forEach(p => {
  let c = fs.readFileSync(p.path, 'utf8');
  c = c.replace(
    '<StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} />',
    `<StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} title="${p.title}" description="${p.desc}" />`
  );
  fs.writeFileSync(p.path, c);
});
