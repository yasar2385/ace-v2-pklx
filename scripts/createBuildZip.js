import { readFileSync, existsSync, createWriteStream, mkdirSync } from 'fs';
import archiver from 'archiver';
import { format } from 'date-fns';
import path from 'path';
import { fileURLToPath } from 'url';

const getCurrentDir = () => path.dirname(fileURLToPath(import.meta.url));
const getProjectRoot = () => path.resolve(getCurrentDir(), '../');

const createZip = async () => {
  const outputFolder = path.resolve(getProjectRoot(), 'builds');
  const distPath = path.resolve(getProjectRoot(), 'dist');
  
  if (!existsSync(distPath)) {
    throw new Error('dist directory not found! Run build first.');
  }

  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder, { recursive: true });
  }

  const formattedDate = format(new Date(), 'yyyy_MM_dd_HH_mm_ss');
  const zipFilePath = path.join(outputFolder, `${formattedDate}.zip`);
  
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Created: ${zipFilePath}`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(distPath, false);
    archive.finalize();
  });
};

createZip().catch(console.error);