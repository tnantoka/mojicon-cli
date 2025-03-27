#!/usr/bin/env node

import fs from 'fs';

import { Command } from 'commander';

import {
  RenderOptions,
  DEFAULT_RENDER_OPTIONS,
  DEFAULT_ITEM_OPTIONS,
  DEFAULT_TEXT_FONT,
  DEFAULT_ICON_FONT,
} from './options';
import { renderImage } from './image_renderer';
import { version } from '../package.json';

export async function main(args: string[] = process.argv): Promise<void> {
  try {
    const program = new Command();
    program
      .version(version)
      .description(
        'Generate various icons with text and symbols from Google Fonts',
      )

      // Global Options
      .option(
        '-w, --width [width]',
        'Icon width in pixels',
        DEFAULT_RENDER_OPTIONS.width.toString(),
      )
      .option('-h, --height [height]', 'Icon height in pixels (default: width)')
      .option(
        '-c, --text-color [color]',
        'Text color (#RRGGBB or #RGB format)',
        DEFAULT_RENDER_OPTIONS.textColor,
      )
      .option(
        '-b, --bg-color [color]',
        'Background color (#RRGGBB or #RGB format)',
        DEFAULT_RENDER_OPTIONS.backgroundColor,
      )
      .option(
        '--bg-alpha [alpha]',
        'Background transparency (0-1)',
        DEFAULT_RENDER_OPTIONS.backgroundAlpha.toString(),
      )
      .option(
        '-r, --radius [radius]',
        'Corner radius',
        DEFAULT_RENDER_OPTIONS.radius.toString(),
      )
      .option(
        '-o, --output [filename]',
        'Output file path',
        DEFAULT_RENDER_OPTIONS.output,
      )

      // Item options
      .option('-m, --mode [mode]', 'Generation mode: text | icon', 'text')
      .option(
        '-l, --label [label]',
        'Text label or icon name (default: "A" for text, "search" for icon)',
      )
      .option(
        '-f, --font [font]',
        `Font name (default: "${DEFAULT_TEXT_FONT}" for text, "${DEFAULT_ICON_FONT}" for icon)`,
      )
      .option(
        '-s, --font-size [size]',
        'Font size in pixels',
        DEFAULT_ITEM_OPTIONS.fontSize.toString(),
      )
      .option(
        '-v, --variant [variant]',
        'Font variant',
        DEFAULT_ITEM_OPTIONS.variant,
      )
      .option('-x, --x [x]', 'X position', DEFAULT_ITEM_OPTIONS.x.toString())
      .option('-y, --y [y]', 'Y position', DEFAULT_ITEM_OPTIONS.y.toString())
      .option(
        '-a, --angle [angle]',
        'Rotation angle in degrees',
        DEFAULT_ITEM_OPTIONS.angle.toString(),
      )

      // JSON
      .option('-j, --json [filename]', 'a JSON file to configure all options')
      .option('--sample-json', 'output a sample JSON content');

    program.parse(args);
    const cmdOptions = program.opts();

    if (cmdOptions.sampleJson) {
      console.log(JSON.stringify(DEFAULT_RENDER_OPTIONS, null, 2));
      return;
    }

    const width = parseInt(cmdOptions.width);
    const height = cmdOptions.height ? parseInt(cmdOptions.height) : width;
    const label =
      cmdOptions.label ?? (cmdOptions.mode === 'icon' ? 'search' : 'A');
    const font =
      cmdOptions.font ??
      (cmdOptions.mode === 'icon' ? DEFAULT_ICON_FONT : DEFAULT_TEXT_FONT);

    const renderOptions: RenderOptions = {
      width,
      height,
      textColor: cmdOptions.textColor,
      backgroundColor: cmdOptions.bgColor,
      backgroundAlpha: parseFloat(cmdOptions.bgAlpha),
      radius: parseInt(cmdOptions.radius),
      output: cmdOptions.output,
      items: [
        {
          mode: cmdOptions.mode,
          label,
          font,
          fontSize: parseInt(cmdOptions.fontSize),
          variant: cmdOptions.variant,
          x: parseInt(cmdOptions.x),
          y: parseInt(cmdOptions.y),
          angle: parseInt(cmdOptions.angle),
        },
      ],
    };

    await renderImage({
      ...renderOptions,
      ...(cmdOptions.json &&
        JSON.parse(fs.readFileSync(cmdOptions.json, 'utf8'))),
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// istanbul ignore next
if (require.main === module) {
  main();
}
