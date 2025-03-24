import fs from 'fs';
import path from 'path';
import os from 'os';

import { generateIcon } from '../src/icon_generator';
import { IconOptions, DEFAULT_ICON_OPTIONS } from '../src/options';

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

describe('generateIcon', () => {
  const testOutputPath = path.join(os.tmpdir(), 'test.png');
  const fixturesDir = path.join(__dirname, 'fixtures');

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.rmSync(testOutputPath);
    }
  });

  it('generates icon with default styles', async () => {
    const options: IconOptions = {
      ...DEFAULT_ICON_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      fontSize: 48,
    };

    await generateIcon(options);

    expect(fs.existsSync(testOutputPath)).toBe(true);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'default_styles.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('generates icon with custom styles', async () => {
    const options: IconOptions = {
      ...DEFAULT_ICON_OPTIONS,
      output: testOutputPath,
      width: 32,
      height: 32,
      fontSize: 24,
      backgroundColor: '#F00',
      backgroundAlpha: 0.5,
      font: 'roboto condensed',
      variant: 'italic',
      textColor: '#00FF00',
      letter: 'b',
      x: 10,
      y: 5,
      radius: 16,
      angle: 45,
    };

    await generateIcon(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'custom_styles.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('generate icon with code', async () => {
    const options: IconOptions = {
      ...DEFAULT_ICON_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      fontSize: 48,
      font: 'Material Icons',
      code: 'search',
    };

    await generateIcon(options);

    expect(fs.existsSync(testOutputPath)).toBe(true);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(path.join(fixturesDir, 'search.png'));

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('generate default code icon with invalid code', async () => {
    const options: IconOptions = {
      ...DEFAULT_ICON_OPTIONS,
      output: testOutputPath,
      width: 64,
      height: 64,
      fontSize: 48,
      font: 'Material Icons',
      code: 'invalid',
    };

    await generateIcon(options);

    expect(fs.existsSync(testOutputPath)).toBe(true);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(path.join(fixturesDir, '10k.png'));

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });
});
