import fs from 'fs';
import path from 'path';
import os from 'os';

import { generateIcon } from '../src/icon_generator';
import { IconOptions } from '../src/types';

describe('generateIcon', () => {
  const testOutputPath = path.join(os.tmpdir(), 'test.png');
  const fixturesDir = path.join(__dirname, 'fixtures');

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
    }
  });

  it('generates white square icon with 64px', async () => {
    const options: IconOptions = {
      output: testOutputPath,
      size: 64,
      backgroundColor: '#FFFFFF',
      backgroundAlpha: 1.0,
    };

    await generateIcon(options);

    expect(fs.existsSync(testOutputPath)).toBe(true);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'white_square_64px.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });

  it('generates red square icon with 32px', async () => {
    const options: IconOptions = {
      output: testOutputPath,
      size: 32,
      backgroundColor: '#F00',
      backgroundAlpha: 1.0,
    };

    await generateIcon(options);

    const generatedImage = fs.readFileSync(testOutputPath);
    const expectedImage = fs.readFileSync(
      path.join(fixturesDir, 'red_square_32px.png'),
    );

    expect(Buffer.compare(generatedImage, expectedImage)).toBe(0);
  });
});
