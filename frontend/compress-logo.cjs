const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'src', 'assets', 'logo.png');
const outputPath = path.join(__dirname, 'src', 'assets', 'logo_optimized.webp');

sharp(inputPath)
  .resize(400) // 400px width is plenty for a navbar logo
  .webp({ quality: 80 }) 
  .toFile(outputPath)
  .then(info => {
    console.log('Optimized logo successfully:', info);
  })
  .catch(err => {
    console.error('Error optimizing logo:', err);
  });
