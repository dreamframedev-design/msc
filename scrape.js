const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadImages() {
  try {
    const response = await fetch('https://www.mightysparkcomms.com/portfolio');
    const html = await response.text();
    
    // Extract all image URLs from the HTML
    // Wix uses static.wixstatic.com
    const imgRegex = /https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~\-]+\.(png|jpg|jpeg|webp|avif)/g;
    const matches = html.match(imgRegex);
    
    if (!matches) {
      console.log('No images found');
      return;
    }
    
    // Deduplicate
    const uniqueUrls = [...new Set(matches)];
    console.log(`Found ${uniqueUrls.length} unique images`);
    
    let count = 0;
    for (const url of uniqueUrls) {
      const filename = url.split('/').pop();
      const filepath = path.join(__dirname, 'public', 'images', 'portfolio', filename);
      
      await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded: ${filename}`);
            count++;
            resolve();
          });
        }).on('error', (err) => {
          console.error(`Error downloading ${url}:`, err.message);
          resolve(); // Continue even if one fails
        });
      });
    }
    
    console.log(`Successfully downloaded ${count} images`);
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadImages();
