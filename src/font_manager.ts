import fs from 'fs';
import os from 'os';
import path from 'path';

import { download } from './http_utils';

import webFonts from './fonts/webfonts.json';

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

export const roboto = webFonts.find((font) => font.family === 'Roboto')!;

interface FoundFont {
  label: string;
  path: string;
}

export const findFont = async (
  name: string,
  variant: string,
): Promise<FoundFont> => {
  let foundItem = roboto;
  let foundFamily = 'Roboto';
  let foundVariant = 'Regular';
  let foundFile = foundItem.files['regular']!;

  const item = webFonts.find(
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

  const foundFont = {
    label: `${foundFamily} (${foundVariant})`,
    path: path.join(
      getFontsDir(),
      `${foundFamily.replace(/\s/g, '')}-${foundVariant}.ttf`,
    ),
  };

  if (!fs.existsSync(foundFont.path)) {
    await download(foundFile, foundFont.path);
  }

  return foundFont;
};
