const fs = require('fs');

async function analyzePortfolio() {
  const response = await fetch('https://www.mightysparkcomms.com/portfolio');
  const html = await response.text();
  fs.writeFileSync('portfolio.html', html);
  console.log('Saved to portfolio.html');
}

analyzePortfolio();