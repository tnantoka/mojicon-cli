#!/usr/bin/env node

import { Command } from 'commander';

import {
  IconOptions,
  DEFAULT_ICON_OPTIONS,
  DEFAULT_CODE_FONT,
  DEFAULT_ITEM_OPTIONS,
} from './options';
import { generateIcon } from './icon_generator';

export async function main(args: string[] = process.argv): Promise<void> {
  try {
    const program = new Command();
    program
      .version('0.1.0')
      .description(
        'Generate various icons with text and symbols from Google Fonts',
      )
      .option(
        '-o, --output [filename]',
        'Output file path',
        DEFAULT_ICON_OPTIONS.output,
      )
      .option(
        '-w, --width [width]',
        'Icon width in pixels',
        DEFAULT_ICON_OPTIONS.width.toString(),
      )
      .option('-h, --height [height]', 'Icon height in pixels')
      .option(
        '-b, --bg-color [color]',
        'Background color (#RRGGBB format)',
        DEFAULT_ICON_OPTIONS.backgroundColor,
      )
      .option(
        '--bg-alpha [alpha]',
        'Background transparency (0-1)',
        DEFAULT_ICON_OPTIONS.backgroundAlpha.toString(),
      )
      .option('-f, --font [font]', 'Font name', DEFAULT_ITEM_OPTIONS.font)
      .option(
        '-v, --variant [variant]',
        'Font variant',
        DEFAULT_ITEM_OPTIONS.variant,
      )
      .option(
        '-t, --text-color [color]',
        'Text color (#RRGGBB format)',
        DEFAULT_ICON_OPTIONS.textColor,
      )
      .option(
        '-l, --letter [letter]',
        'Letter to display',
        DEFAULT_ITEM_OPTIONS.letter,
      )
      .option(
        '-s, --font-size [size]',
        'Font size in pixels',
        DEFAULT_ITEM_OPTIONS.fontSize.toString(),
      )
      .option('-c, --code [code]', 'Font icon code', DEFAULT_ITEM_OPTIONS.code)
      .option('-x, --x [x]', 'X position', DEFAULT_ITEM_OPTIONS.x.toString())
      .option('-y, --y [y]', 'Y position', DEFAULT_ITEM_OPTIONS.y.toString())
      .option(
        '-r, --radius [radius]',
        'Corner radius',
        DEFAULT_ICON_OPTIONS.radius.toString(),
      )
      .option(
        '-a, --angle [angle]',
        'Rotation angle in degrees',
        DEFAULT_ITEM_OPTIONS.angle.toString(),
      );

    program.parse(args);
    const cmdOptions = program.opts();

    const font =
      cmdOptions.code && cmdOptions.font === DEFAULT_ITEM_OPTIONS.font
        ? DEFAULT_CODE_FONT
        : cmdOptions.font;

    const iconOptions: IconOptions = {
      output: cmdOptions.output,
      width: parseInt(cmdOptions.width),
      height: parseInt(cmdOptions.height ?? cmdOptions.width),
      backgroundColor: cmdOptions.bgColor,
      backgroundAlpha: parseFloat(cmdOptions.bgAlpha),
      textColor: cmdOptions.textColor,
      radius: parseInt(cmdOptions.radius),
      items: [
        {
          letter: cmdOptions.letter,
          code: cmdOptions.code,
          font,
          fontSize: parseInt(cmdOptions.fontSize),
          variant: cmdOptions.variant,
          x: parseInt(cmdOptions.x),
          y: parseInt(cmdOptions.y),
          angle: parseInt(cmdOptions.angle),
        },
      ],
    };

    await generateIcon(iconOptions);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// istanbul ignore next
if (require.main === module) {
  main();
}
