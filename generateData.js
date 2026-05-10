const fs = require('fs');

const mapped = JSON.parse(fs.readFileSync('mapped_images.json', 'utf8'));

const getFile = (index) => {
  if (!mapped[index]) return null;
  let filename = mapped[index].filename;
  filename = decodeURIComponent(filename);
  return `/images/portfolio/${filename}`;
};

const websites = [
  {
    name: "Poseidon",
    logo: "/portoflio client logos/poseidon logos-18 (2).svg",
    icon: "/portoflio client logos/poseidon logo favicon-28 (1).svg",
    images: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(getFile)
  },
  {
    name: "Frenelle",
    logo: "/portoflio client logos/Frenelle logo svg-15 (1).svg",
    images: [12, 18, 19, 20, 21, 22, 23, 24, 25].map(getFile)
  },
  {
    name: "KeifeRx",
    logo: "/portoflio client logos/keiferx typeface logo_Primary Light Bkg Logo (2).svg",
    images: [26, 27, 28, 29, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68].map(getFile)
  },
  {
    name: "Actym",
    logo: getFile(54),
    images: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41].map(getFile)
  },
  {
    name: "RSO",
    logo: "/portoflio client logos/RSO-LOGO COLOR + TAGLINE copy-02.svg",
    icon: "/portoflio client logos/rso icon-03.svg",
    images: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53].map(getFile)
  },
  {
    name: "Paint Therapeutics",
    logo: "/portoflio client logos/Paint Therapeutics Typefaces and Logo-23 (1) (1).svg",
    images: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82].map(getFile)
  }
];

const deckTransformations = [
  {
    name: "Actym",
    before: getFile(14),
    after: getFile(15)
  },
  {
    name: "Poseidon",
    before: getFile(16),
    after: getFile(17)
  },
  {
    name: "KeifeRx",
    before: getFile(55),
    after: getFile(56)
  },
  {
    name: "Paint Therapeutics",
    before: getFile(69),
    after: getFile(70)
  }
];

const output = `
export const websites = ${JSON.stringify(websites, null, 2)};
export const deckTransformations = ${JSON.stringify(deckTransformations, null, 2)};
`;

fs.writeFileSync('src/app/portfolio/data.ts', output);
console.log('Done writing data.ts');
