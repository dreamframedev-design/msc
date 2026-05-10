const fs = require('fs');

const images = JSON.parse(fs.readFileSync('images.json', 'utf8'));

const mapped = images.map((url, i) => {
  const filename = url.split('/').find(part => part.includes('~mv2'));
  return {
    index: i,
    filename: filename ? filename.split('~mv2')[0] + '~mv2' + (filename.includes('.png') ? '.png' : '.jpg') : 'unknown',
    url: url
  };
});

fs.writeFileSync('mapped_images.json', JSON.stringify(mapped, null, 2));
console.log('Done');
