#!/usr/bin/env node

import { Command } from 'commander';

import { IconOptions } from './types';
import { generateIcon } from './icon_generator';

export async function main(args: string[] = process.argv): Promise<void> {
  try {
    const program = new Command();
    program
      .version('0.1.0')
      .description(
        'Generate various icons with text and symbols from Google Fonts',
      )
      .option('-o, --output [filename]', 'Output file path', './icon.png')
      .option('-s, --size [size]', 'Icon size in pixels', '512')
      .option(
        '-b, --bg-color [color]',
        'Background color (#RRGGBB format)',
        '#FFFFFF',
      )
      .option('--bg-alpha [alpha]', 'Background transparency (0-1)', '1.0');

    program.parse(args);
    const cmdOptions = program.opts();

    const iconOptions: IconOptions = {
      output: cmdOptions.output,
      size: parseInt(cmdOptions.size),
      backgroundColor: cmdOptions.bgColor,
      backgroundAlpha: parseFloat(cmdOptions.bgAlpha),
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
