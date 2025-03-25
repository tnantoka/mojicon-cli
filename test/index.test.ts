import { main } from '../src/index';

import { renderImage } from '../src/image_renderer';
import {
  DEFAULT_RENDER_OPTIONS,
  DEFAULT_ITEM_OPTIONS,
  DEFAULT_ICON_FONT,
} from '../src/options';

jest.mock('../src/image_renderer', () => ({
  renderImage: jest.fn().mockResolvedValue(undefined),
}));

describe('main', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls renderImage with default options with no args', async () => {
    const origArgv = process.argv;

    process.argv = ['node', 'index.js'];

    try {
      await main();

      expect(renderImage).toHaveBeenCalledWith({
        ...DEFAULT_RENDER_OPTIONS,
      });
    } finally {
      process.argv = origArgv;
    }
  });

  it('calls renderImage with custom options', async () => {
    await main([
      'node',
      'index.js',

      '--text-color',
      '#00FF00',
      '--bg-color',
      '#FF0000',
      '--bg-alpha',
      '0.5',
      '--width',
      '128',
      '--height',
      '128',
      '--radius',
      '5',
      '--output',
      'custom.png',

      '--mode',
      'text',
      '--label',
      'B',
      '--font',
      'Roboto Condensed',
      '--font-size',
      '64',
      '--variant',
      'Italic',
      '--x',
      '10',
      '--y',
      '20',
      '--angle',
      '90',
    ]);

    expect(renderImage).toHaveBeenCalledWith({
      width: 128,
      height: 128,
      textColor: '#00FF00',
      backgroundColor: '#FF0000',
      backgroundAlpha: 0.5,
      radius: 5,
      output: 'custom.png',
      items: [
        {
          mode: 'text',
          label: 'B',
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

  it('calls renderImage with icon mode', async () => {
    await main(['node', 'index.js', '--mode', 'icon']);

    expect(renderImage).toHaveBeenCalledWith({
      ...DEFAULT_RENDER_OPTIONS,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          mode: 'icon',
          label: 'search',
          font: DEFAULT_ICON_FONT,
        },
      ],
    });
  });

  it('handles error', async () => {
    (renderImage as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

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
