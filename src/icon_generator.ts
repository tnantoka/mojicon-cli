import fs from 'fs';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

import type { IconOptions } from './options';
import { parseColor } from './color_parser';
import { findFont } from './font_manager';

export const generateIcon = async (options: IconOptions): Promise<void> => {
  const font = await findFont(options.font, options.variant, !!options.code);
  GlobalFonts.registerFromPath(font.path, font.label);

  const canvas = createCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = parseColor(options.backgroundColor, options.backgroundAlpha);

  if (options.radius > 0) {
    const r = options.radius;
    const w = canvas.width;
    const h = canvas.height;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, options.width, options.height);
  }

  ctx.font = `${options.fontSize}px ${font.label}`;
  ctx.fillStyle = options.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.translate(options.width / 2 + options.x, options.height / 2 + options.y);
  ctx.rotate((options.angle * Math.PI) / 180);

  if (options.code) {
    const codepoint = (
      font.codepoints.find((c) => c.name === options.code) ?? font.codepoints[0]
    ).codepoint;
    const charCode = parseInt(codepoint, 16);
    const text = String.fromCodePoint(charCode);
    ctx.fillText(text, 0, 0);
  } else {
    ctx.fillText(options.letter, 0, 0);
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(options.output, buffer);

  console.log(`Icon generated successfully: ${options.output}`);
};
