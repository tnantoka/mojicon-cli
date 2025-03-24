import { main } from '../src/index';

import { generateIcon } from '../src/icon_generator';
import {
  DEFAULT_CODE_FONT,
  DEFAULT_ICON_OPTIONS,
  DEFAULT_ITEM_OPTIONS,
} from '../src/options';

jest.mock('../src/icon_generator', () => ({
  generateIcon: jest.fn().mockResolvedValue(undefined),
}));

describe('main', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls generateIcon with default options with no args', async () => {
    const origArgv = process.argv;

    process.argv = ['node', 'index.js'];

    try {
      await main();

      expect(generateIcon).toHaveBeenCalledWith({
        ...DEFAULT_ICON_OPTIONS,
      });
    } finally {
      process.argv = origArgv;
    }
  });

  it('calls generateIcon with custom options', async () => {
    await main([
      'node',
      'index.js',
      '--output',
      'custom.png',
      '--width',
      '128',
      '--height',
      '128',
      '--bg-color',
      '#FF0000',
      '--bg-alpha',
      '0.5',
      '--font',
      'Roboto Condensed',
      '--variant',
      'Italic',
      '--text-color',
      '#00FF00',
      '--letter',
      'B',
      '--font-size',
      '64',
      '--code',
      'search',
      '--x',
      '10',
      '--y',
      '20',
      '--radius',
      '5',
      '--angle',
      '90',
    ]);

    expect(generateIcon).toHaveBeenCalledWith({
      output: 'custom.png',
      width: 128,
      height: 128,
      backgroundColor: '#FF0000',
      backgroundAlpha: 0.5,
      textColor: '#00FF00',
      radius: 5,
      items: [
        {
          letter: 'B',
          code: 'search',
          font: 'Roboto Condensed',
          fontSize: 64,
          variant: 'Italic',
          x: 10,
          y: 20,
          angle: 90,
        },
      ],
    });
  });

  it('calls generateIcon with code options', async () => {
    await main(['node', 'index.js', '--code', 'search']);

    expect(generateIcon).toHaveBeenCalledWith({
      ...DEFAULT_ICON_OPTIONS,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          code: 'search',
          font: DEFAULT_CODE_FONT,
        },
      ],
    });
  });

  it('handles error', async () => {
    (generateIcon as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

    try {
      await main(['node', 'index.js']);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
      expect(processExitSpy).toHaveBeenCalledWith(1);
    } finally {
      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    }
  });
});
