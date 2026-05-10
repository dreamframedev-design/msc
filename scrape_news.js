const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const links = [
  'https://www.mightysparkcomms.com/post/why-biotech-companies-need-professional-communications-services-in-2025',
  'https://www.mightysparkcomms.com/post/top-biotech-communication-pitfalls-and-how-our-services-prevent-them',
  'https://www.mightysparkcomms.com/post/key-themes-and-trends-from-jp-morgan-healthcare-conference-2025',
  'https://www.mightysparkcomms.com/post/the-power-of-precision-why-excellent-scientific-illustrations-matter-in-biotech-communications-1',
  'https://www.mightysparkcomms.com/post/the-power-of-precision-why-excellent-scientific-illustrations-matter-in-biotech-communications',
  'https://www.mightysparkcomms.com/post/step-by-step-guide-the-secrets-to-nailing-your-biotech-corporate-deck'
];

async function scrapeArticles() {
  const articles = [];
  
  for (const link of links) {
    try {
      console.log(`Fetching ${link}...`);
      const response = await fetch(link);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Wix blog posts usually have specific classes, but let's try to get the main article body.
      // We can look for article tag or specific data-hook
      
      const title = $('h1').first().text().trim() || $('title').text().replace(' | Mighty Spark', '').trim();
      
      // Try to extract paragraphs
      const paragraphs = [];
      $('article p, .blog-post-content p, [data-hook="post-description"] p, [data-hook="post-content"] p, span[style*="font-family"]').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          paragraphs.push(text);
        }
      });
      
      // Filter out duplicate paragraphs and navigation junk
      const uniqueParagraphs = [...new Set(paragraphs)].filter(p => 
        !p.includes('Log in') && 
        !p.includes('Sign up') &&
        !p.includes('Bottom of page')
      );
      
      const slug = link.split('/').pop();
      
      articles.push({
        title,
        slug,
        url: link,
        content: uniqueParagraphs
      });
      
    } catch (e) {
      console.error(`Error fetching ${link}:`, e);
    }
  }
  
  fs.writeFileSync(path.join(__dirname, 'scraped_articles.json'), JSON.stringify(articles, null, 2));
  console.log('Saved to scraped_articles.json');
}

scrapeArticles();