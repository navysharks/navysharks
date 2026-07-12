const fs = require('fs');
const lines = fs.readFileSync('src/app/pages/Membership.tsx', 'utf8').split('\n');
const destLines = lines.slice(107, 456); // 108 to 456 are 0-indexed as 107 to 456
fs.writeFileSync('src/app/data/destinations.ts', 'import { experiencesComingSoonBackgrounds } from "../comingSoonBackgrounds";\n\nexport ' + destLines.join('\n'));
console.log('Done!');
