import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';

import { DEFAULT_ICON_FONT, DEFAULT_TEXT_FONT } from './options';

interface FontItem {
  family: string;
  variants: string[];
  files: { [key: string]: string };
  codepoints: { name: string; codepoint: string }[];
}

let webFonts: FontItem[] = [];
let iconFonts: FontItem[] = [];
let roboto: FontItem = { family: '', variants: [], files: {}, codepoints: [] };
let materialIcons: FontItem = roboto;

interface FoundFont {
  label: string;
  path: string;
  codepoints: { name: string; codepoint: string }[];
}

export const findFont = async (
  name: string,
  variant: string,
  isIconMode: boolean,
): Promise<FoundFont> => {
  await initFontList();

  const fonts = isIconMode ? iconFonts : webFonts;
  let foundItem = isIconMode ? materialIcons : roboto;
  let foundFamily = isIconMode ? DEFAULT_ICON_FONT : DEFAULT_TEXT_FONT;
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

  await cacheFont(foundFile, foundFont.path);

  return foundFont;
};

const initFontList = async () => {
  if (webFonts.length && iconFonts.length) {
    return;
  }

  await cacheFontList();

  webFonts = JSON.parse(
    fs.readFileSync(path.join(getFontsDir(), 'webfonts.json'), 'utf-8'),
  );
  iconFonts = JSON.parse(
    fs.readFileSync(path.join(getFontsDir(), 'iconfonts.json'), 'utf-8'),
  );
  roboto = webFonts.find((font) => font.family === DEFAULT_TEXT_FONT)!;
  materialIcons = iconFonts[0];
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

export const cacheFontList = async () => {
  const dir = getFontsDir();
  const webFontsPath = path.join(dir, 'webfonts.json');
  const iconFontsPath = path.join(dir, 'iconfonts.json');

  const rootURL = 'https://tnantoka.github.io/mojicon-cli/fonts/v1/';

  await cacheFile(`${rootURL}webfonts.json`, webFontsPath);
  await cacheFile(`${rootURL}iconfonts.json`, iconFontsPath);
};

const cacheFont = async (url: string, path: string) => {
  await cacheFile(url, path);
};

const cacheFile = async (url: string, path: string) => {
  if (fs.existsSync(path)) {
    return;
  }

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
