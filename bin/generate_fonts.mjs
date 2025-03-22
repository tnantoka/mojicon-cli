/* global console, process */

import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const KEY = process.env.GOOGLE_FONTS_API_KEY;
const DEBUG = !!process.env.DEBUG;

const MATERIAL_ICONS = [
  'Material Icons',
  'Material Icons Outlined',
  'Material Icons Round',
  'Material Icons Sharp',
  'Material Icons Two Tone',
];

const download = async (url, name) => {
  const data = await new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });
  });
  fs.writeFileSync(`./tmp/${name}`, data);
  return data;
};

const downloadRawFiles = async () => {
  if (DEBUG) {
    return {
      webFonts: JSON.parse(fs.readFileSync('./tmp/webfonts.json')),
      materialIcons: MATERIAL_ICONS.map((family) => {
        const filename = family.toLowerCase().replace(/\s/g, '_');
        return {
          css: fs.readFileSync(`./tmp/${filename}.css`),
          codepoints: fs.readFileSync(`./tmp/${filename}.codepoints`),
        };
      }),
    };
  }

  const webFonts = await download(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${KEY}`,
    'webfonts.json',
  );

  const materialIcons = await Promise.all(
    MATERIAL_ICONS.map(async (family) => {
      const filename = family.toLowerCase().replace(/\s/g, '_');
      return {
        css: await download(
          `https://fonts.googleapis.com/css2?family=${family.replace(/\s/g, '+')}`,
          `${filename}.css`,
        ),
        codepoints: await download(
          `https://raw.githubusercontent.com/google/material-design-icons/master/font/${family.replace(/\s/g, '')}-Regular.codepoints`,
          `${filename}.codepoints`,
        ),
      };
    }),
  );

  return { webFonts, materialIcons };
};

const main = async () => {
  const { webFonts, materialIcons } = await downloadRawFiles();

  console.log(webFonts.items.length);
  console.log(materialIcons.length);

  // webFonts.itemsをsrc/fonts/webfonts.jsonに保存
  fs.writeFileSync(
    './src/fonts/webfonts.json',
    JSON.stringify(webFonts.items, null, 2),
  );
};

main();
