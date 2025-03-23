import fs from 'fs';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

import type { IconOptions } from './options';
import { parseColor } from './color_parser';
import { findFont } from './font_manager';

export const generateIcon = async (options: IconOptions): Promise<void> => {
  const font = await findFont(options.font, options.variant);
  GlobalFonts.registerFromPath(font.path, font.label);

  const canvas = createCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = parseColor(options.backgroundColor, options.backgroundAlpha);
  ctx.fillRect(0, 0, options.width, options.height);

  ctx.font = `${options.fontSize}px ${font.label}`;
  ctx.fillStyle = options.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(options.letter, options.width / 2, options.height / 2);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(options.output, buffer);

  console.log(`Icon generated successfully: ${options.output}`);
};
