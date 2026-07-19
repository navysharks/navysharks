const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputPath = path.join(__dirname, 'src', 'imports', 'small.mp4');
const outputPath = path.join(__dirname, 'src', 'imports', 'small_optimized.mp4');

console.log('Starting compression... This might take a minute or two.');

ffmpeg(inputPath)
  .outputOptions([
    '-vcodec libx264',
    '-crf 28', // Lower means better quality. 28 is a good balance for web video.
    '-preset faster', // Balances compression speed and file size
    '-movflags +faststart' // Optimizes video for web streaming (loads faster)
  ])
  .on('end', () => {
    console.log('Compression finished successfully!');
  })
  .on('error', (err) => {
    console.error('Error during compression:', err);
  })
  .save(outputPath);
