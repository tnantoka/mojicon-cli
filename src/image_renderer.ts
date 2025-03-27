import fs from 'fs';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

import type { RenderOptions } from './options';
import { parseColor } from './color_parser';
import { findFont } from './font_manager';

export const renderImage = async (options: RenderOptions): Promise<void> => {
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

  const usedFonts = await Promise.all(
    options.items.map(async (item) => {
      ctx.save();

      const font = await findFont(
        item.font,
        item.variant,
        item.mode === 'icon',
      );
      GlobalFonts.registerFromPath(font.path, font.label);

      ctx.font = `${item.fontSize}px ${font.label}`;
      ctx.fillStyle = options.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.translate(options.width / 2 + item.x, options.height / 2 + item.y);
      ctx.rotate((item.angle * Math.PI) / 180);

      if (item.mode === 'icon') {
        const codepoint = (
          font.codepoints.find((c) => c.name === item.label) ??
          font.codepoints[0]
        ).codepoint;
        const charCode = parseInt(codepoint, 16);
        const text = String.fromCodePoint(charCode);
        ctx.fillText(text, 0, 0);
      } else {
        ctx.fillText(item.label, 0, 0);
      }

      ctx.restore();

      return font;
    }),
  );

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(options.output, buffer);

  console.log(`Icon generated successfully: ${options.output}`);
  console.log('');
  console.log('Used fonts:');
  usedFonts.forEach((font, i) => {
    const item = options.items[i];
    console.log(`- ${item.label}: ${font.label} (requested: ${item.font})`);
  });
};
