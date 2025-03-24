import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';

import webFonts from './fonts/webfonts.json';
import iconFonts from './fonts/iconfonts.json';

export const roboto = webFonts.find((font) => font.family === 'Roboto')!;
export const materialIcons = iconFonts[0];

interface FoundFont {
  label: string;
  path: string;
  codepoints: { name: string; codepoint: string }[];
}

export const findFont = async (
  name: string,
  variant: string,
  withCode: boolean,
): Promise<FoundFont> => {
  const fonts = withCode ? iconFonts : webFonts;
  let foundItem = withCode ? materialIcons : roboto;
  let foundFamily = withCode ? 'Material Icons' : 'Roboto';
  let foundVariant = 'Regular';
  let foundFile = foundItem.files['regular']!;

  const item = fonts.find(
    (font) => font.family.toLowerCase() === name.toLowerCase(),
  );
  if (item) {
    foundItem = item;
    foundFamily = item.family;

    const normalizedVariant = normalizeVariant(variant);
    const file = Object.entries(item.files)
      .find(([key]) => normalizeVariant(key) === normalizedVariant)
      ?.pop();
    if (file) {
      foundVariant = normalizedVariant;
      foundFile = file;
    } else {
      foundVariant = 'Regular';
      foundFile = item.files['regular']!;
    }
  }

  const label = `${foundFamily.replace(/\s/g, '')}-${foundVariant}`;
  const foundFont = {
    label,
    path: path.join(getFontsDir(), `${label}.${foundFile.split('.').pop()}`),
    codepoints: foundItem.codepoints,
  };

  if (!fs.existsSync(foundFont.path)) {
    await cacheFont(foundFile, foundFont.path);
  }

  return foundFont;
};

const getFontsDir = () => {
  const fontsDir = path.join(os.homedir(), '.mojicon', 'fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
  return fontsDir;
};

const normalizeVariant = (variant: string) => {
  return variant
    .replace('italic', 'Italic')
    .replace('regular', 'Regular')
    .replace('100', 'Thin')
    .replace('200', 'ExtraLight')
    .replace('300', 'Light')
    .replace('500', 'Medium')
    .replace('600', 'SemiBold')
    .replace('700', 'Bold')
    .replace('800', 'ExtraBold')
    .replace('900', 'Black');
};

export const cacheFont = async (url: string, path: string) => {
  const data = await new Promise<Buffer>((resolve) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
  });
  fs.writeFileSync(path, data);
};
