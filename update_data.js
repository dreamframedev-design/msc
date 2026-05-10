const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src/app/portfolio/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

const newBrands = ['resolve', 'medicenna', 'leon', 'lytix', 'pbl', 'celltaxis'];
const newWebsites = [];

for (const brand of newBrands) {
  const brandDir = path.join(__dirname, 'public/images/portfolio', brand);
  if (!fs.existsSync(brandDir)) continue;

  const files = fs.readdirSync(brandDir);
  const svgs = files.filter(f => f.endsWith('.svg'));
  const pngs = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.avif'));

  let logo = '';
  let icon = '';

  if (svgs.length > 0) {
    // Try to guess logo vs icon
    const iconFile = svgs.find(f => f.toLowerCase().includes('icon') || f.toLowerCase().includes('favicon'));
    const logoFile = svgs.find(f => f !== iconFile) || svgs[0];
    
    if (logoFile) logo = `/images/portfolio/${brand}/${logoFile}`;
    if (iconFile) icon = `/images/portfolio/${brand}/${iconFile}`;
  }

  const images = pngs.map(f => `/images/portfolio/${brand}/${f}`);

  // Capitalize brand name
  let brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  if (brand === 'pbl') brandName = 'PBL Assay Science';
  if (brand === 'celltaxis') brandName = 'CellTaxis';
  if (brand === 'medicenna') brandName = 'Medicenna';

  newWebsites.push({
    name: brandName,
    logo,
    icon,
    images
  });
}

// Now we need to insert newWebsites into the websites array in data.ts
const match = dataContent.match(/export const websites = \[\n/);
if (match) {
  const insertPos = match.index + match[0].length;
  
  let insertStr = '';
  for (const site of newWebsites) {
    insertStr += `  {\n`;
    insertStr += `    "name": "${site.name}",\n`;
    if (site.logo) insertStr += `    "logo": "${site.logo}",\n`;
    if (site.icon) insertStr += `    "icon": "${site.icon}",\n`;
    insertStr += `    "images": [\n`;
    insertStr += site.images.map(img => `      "${img}"`).join(',\n');
    insertStr += `\n    ]\n  },\n`;
  }

  dataContent = dataContent.slice(0, insertPos) + insertStr + dataContent.slice(insertPos);
  fs.writeFileSync(dataPath, dataContent, 'utf8');
  console.log('Successfully updated data.ts');
} else {
  console.log('Could not find websites array in data.ts');
}
