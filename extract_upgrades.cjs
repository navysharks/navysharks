const fs = require('fs');
const lines = fs.readFileSync('frontend/src/app/pages/Membership.tsx', 'utf8').split('\n');
const upgradeLines = lines.slice(1182, 1420);
fs.writeFileSync('frontend/src/app/data/upgrades.ts', 'export const upgradesData = ' + upgradeLines.join('\n'));
console.log('Done upgrades!');
