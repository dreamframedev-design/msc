const fs = require('fs');
const cheerio = require('cheerio');

async function parsePortfolio() {
  const html = fs.readFileSync('portfolio.html', 'utf8');
  const $ = cheerio.load(html);
  
  // Just print out the image src URLs in order so I can see them
  const images = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('static.wixstatic.com')) {
      images.push(src);
    }
  });
  
  fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
  console.log(`Found ${images.length} images`);
}

parsePortfolio();