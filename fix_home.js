const fs = require('fs');

let c = fs.readFileSync('src/app/(public)/HomePageClient.tsx', 'utf8');

c = c.replace(
  /\{([a-zA-Z]+)\.map\(\(story\) => \(\s*<StoryCard key=\{story\.id\} story=\{story\} \/>\s*\)\)\}/g,
  '{$1.map((story) => (\n                  <div key={story.id} className="carousel-item">\n                    <StoryCard story={story} />\n                  </div>\n                ))}'
);

c = c.replace(
  /\.stories-carousel > \* \{/g,
  '.carousel-item {'
);

c = c.replace(
  /\.carousel-item \{\s*flex: 0 0 280px;\s*scroll-snap-align: start;\s*\}/g,
  `.carousel-item {
          flex: 0 0 280px;
          scroll-snap-align: start;
          height: 100%;
        }
        
        .carousel-item :global(.scroll-observer-wrapper) {
          height: 100%;
        }`
);

fs.writeFileSync('src/app/(public)/HomePageClient.tsx', c);
