/* global process */

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
          family,
          css: fs.readFileSync(`./tmp/${filename}.css`, 'utf8'),
          codepoints: fs.readFileSync(`./tmp/${filename}.codepoints`, 'utf8'),
        };
      }),
    };
  }

  const webFonts = JSON.parse(
    await download(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${KEY}`,
      'webfonts.json',
    ),
  );

  const materialIcons = await Promise.all(
    MATERIAL_ICONS.map(async (family) => {
      const filename = family.toLowerCase().replace(/\s/g, '_');
      return {
        family,
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

  const dir = './docs/fonts/v1/';

  fs.writeFileSync(
    `${dir}webfonts.json`,
    JSON.stringify(
      webFonts.items.map((item) => ({
        family: item.family,
        variants: item.variants,
        files: item.files,
        codepoints: [],
      })),
      null,
      2,
    ),
  );

  const iconFonts = materialIcons.map((materialIcon) => {
    const file = materialIcon.css.match(/url\((.+?)\)/)[1];
    const codepoints = materialIcon.codepoints
      .split('\n')
      .filter((line) => line)
      .map((line) => {
        const [name, codepoint] = line.split(' ');
        return { name, codepoint };
      });

    return {
      family: materialIcon.family,
      variants: ['regular'],
      files: {
        regular: file,
      },
      codepoints,
    };
  });

  fs.writeFileSync(
    `${dir}iconfonts.json`,
    JSON.stringify(iconFonts, null, 2),
  );
};

main();
