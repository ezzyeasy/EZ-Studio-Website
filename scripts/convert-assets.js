import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../Assets');
const targetDir = path.resolve(__dirname, '../public/Assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function processDirectory(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('._') || entry.name.startsWith('.DS_Store')) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(srcPath, destPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const baseName = path.basename(entry.name, ext);

      // Copy original file
      fs.copyFileSync(srcPath, destPath);

      // Convert PNG / JPG to WebP via Sharp
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const webpPath = path.join(dest, `${baseName}.webp`);
        try {
          await sharp(srcPath)
            .webp({ quality: 85, effort: 4 })
            .toFile(webpPath);
          console.log(`✓ WebP Created: ${baseName}.webp`);
        } catch (err) {
          console.error(`Failed to convert ${entry.name} to WebP:`, err.message);
        }
      }

      // Convert MP4 to WebM via FFmpeg
      if (ext === '.mp4') {
        const webmPath = path.join(dest, `${baseName}.webm`);
        console.log(`Converting video: ${entry.name} -> ${baseName}.webm`);
        try {
          execSync(`ffmpeg -y -i "${srcPath}" -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus "${webmPath}"`, { stdio: 'ignore' });
          console.log(`✓ WebM Created: ${baseName}.webm`);
        } catch (err) {
          console.error(`Failed to convert ${entry.name} to WebM:`, err.message);
        }
      }
    }
  }
}

console.log('Starting Asset Optimization & WebP/WebM Conversion...');
processDirectory(sourceDir, targetDir).then(() => {
  console.log('🎉 All assets optimized and copied to public/Assets/');
});
