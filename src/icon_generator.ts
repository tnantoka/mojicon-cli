import fs from 'fs';
import { Canvas } from '@napi-rs/canvas';

import type { IconOptions } from './types';
import { parseColor } from './color_utils';

export const generateIcon = async (options: IconOptions): Promise<void> => {
  const canvas = new Canvas(options.size, options.size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = parseColor(options.backgroundColor, options.backgroundAlpha);
  ctx.fillRect(0, 0, options.size, options.size);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(options.output, buffer);

  console.log(`Icon generated successfully: ${options.output}`);
};
