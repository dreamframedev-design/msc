const fs = require('fs');
const path = require('path');

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'scraped_articles.json'), 'utf8'));

const cleanData = rawData.map(article => {
  // Remove the "Updated: Mar 29, 2025" and the "Read More" junk at the bottom
  let content = article.content.filter(p => !p.startsWith('Updated:') && !p.includes('In 2025, the biotech industry will be more competitive') && !p.includes('This year\'s conference highlighted') && !p.includes('Let’s face it: biotech hasn’t exactly been the early adopter'));
  
  // Some articles have specific junk at the end because of the "Recent Posts" section
  
  return {
    id: article.slug,
    title: article.title,
    slug: article.slug,
    excerpt: content[0] || '',
    content: content,
    date: '2024-07-23', // Placeholder date
    imageUrl: '/images/news hero.avif' // Placeholder image
  };
});

fs.writeFileSync(path.join(__dirname, 'src/app/news/data.ts'), `export const articles = ${JSON.stringify(cleanData, null, 2)};`);
console.log('Created src/app/news/data.ts');