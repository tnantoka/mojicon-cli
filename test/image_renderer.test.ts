import fs from 'fs';
import path from 'path';
import os from 'os';

import { renderImage } from '../src/image_renderer';
import {
  RenderOptions,
  DEFAULT_RENDER_OPTIONS,
  DEFAULT_ITEM_OPTIONS,
  DEFAULT_ICON_FONT,
} from '../src/options';

jest.mock('os', () => ({
  ...jest.requireActual('os'),
  homedir: jest.fn(() => jest.requireActual('os').tmpdir()),
}));

const roboto = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'Roboto-Regular.ttf'),
);
const robotoCondensed = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'RobotoCondensed-Italic.ttf'),
);
const materialIcons = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'MaterialIcons-Regular.ttf'),
);

jest.mock('https', () => ({
  get: jest.fn((url, cb) => {
    cb({
      on: jest.fn((event, cb) => {
        if (event === 'data') {
          if (url.includes('materialicons')) {
            cb(materialIcons);
          } else if (url.includes('robotocondensed')) {
            cb(robotoCondensed);
          } else {
            cb(roboto);
          }
        } else if (event === 'end') {
          cb();
        }
      }),
    });
  }),
}));

if (fs.existsSync(`${os.tmpdir()}/.mojicon`)) {
  fs.rmSync(`${os.tmpdir()}/.mojicon`, { recursive: true });
}

describe('renderImage', () => {
  const testOutputPath = path.join(os.tmpdir(), 'test.png');
  const fixturesDir = path.join(__dirname, 'fixtures');

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.rmSync(testOutputPath);
    }
  });

  it('render image with default styles', async () => {
    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      width: 64,
      height: 64,
      output: testOutputPath,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          fontSize: 48,
        },
      ],
    };

    await renderImage(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'default_styles.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('render image with custom styles', async () => {
    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      width: 32,
      height: 32,
      textColor: '#00FF00',
      backgroundColor: '#F00',
      backgroundAlpha: 0.5,
      radius: 16,
      output: testOutputPath,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          label: 'b',
          font: 'roboto condensed',
          fontSize: 24,
          variant: 'italic',
          x: 10,
          y: 5,
          angle: 45,
        },
      ],
    };

    await renderImage(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'custom_styles.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('render image with icon font', async () => {
    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      width: 64,
      height: 64,
      output: testOutputPath,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          mode: 'icon',
          label: 'search',
          font: DEFAULT_ICON_FONT,
          fontSize: 48,
        },
      ],
    };

    await renderImage(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(path.join(fixturesDir, 'search.png'));

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('render with first icon for invalid label', async () => {
    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          mode: 'icon',
          label: 'invalid',
          font: DEFAULT_ICON_FONT,
          fontSize: 48,
        },
      ],
    };

    await renderImage(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(path.join(fixturesDir, '10k.png'));

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('render image with multiple items', async () => {
    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          label: 'A',
          fontSize: 48,
          x: -16,
        },
        {
          ...DEFAULT_ITEM_OPTIONS,
          label: 'B',
          fontSize: 48,
          x: 16,
        },
      ],
    };

    await renderImage(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(path.join(fixturesDir, 'items.png'));

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('outputs success message and used fonts', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log');

    const options: RenderOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      items: [
        {
          ...DEFAULT_ITEM_OPTIONS,
          label: 'A',
          font: 'roboto',
          fontSize: 48,
          x: -16,
        },
        {
          ...DEFAULT_ITEM_OPTIONS,
          mode: 'icon',
          label: 'search',
          font: 'material icons',
          fontSize: 48,
          x: 16,
        },
      ],
    };

    await renderImage(options);

    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `Icon generated successfully: ${testOutputPath}`,
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Used fonts:');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      4,
      '- A: Roboto-Regular (requested: roboto)',
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      5,
      '- search: MaterialIcons-Regular (requested: material icons)',
    );
  });
});
