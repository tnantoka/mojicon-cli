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

jest.mock('https', () => ({
  get: jest.fn((url, cb) => {
    cb({
      on: jest.fn((event, cb) => {
        if (event === 'data') {
          cb(url.includes('robotocondensed') ? robotoCondensed : roboto);
        } else if (event === 'end') {
          cb();
        }
      }),
    });
  }),
}));

fs.rmdirSync(`${os.tmpdir()}/.mojicon`, { recursive: true });

describe('generateIcon', () => {
  const testOutputPath = path.join(os.tmpdir(), 'test.png');
  const fixturesDir = path.join(__dirname, 'fixtures');

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
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
      letter: 'B',
    };

    await generateIcon(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'custom_styles.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });
});
