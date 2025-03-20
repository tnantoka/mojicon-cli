import { main } from '../src/index';

import { generateIcon } from '../src/icon_generator';

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
        output: './icon.png',
        size: 512,
        backgroundColor: '#FFFFFF',
        backgroundAlpha: 1.0,
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
      '--size',
      '128',
      '--bg-color',
      '#FF0000',
      '--bg-alpha',
      '0.5',
    ]);

    expect(generateIcon).toHaveBeenCalledWith({
      output: 'custom.png',
      size: 128,
      backgroundColor: '#FF0000',
      backgroundAlpha: 0.5,
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
