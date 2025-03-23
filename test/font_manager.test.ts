import fs from 'fs';
import path from 'path';

import { findFont } from '../src/font_manager';

const tmpdir = jest.requireActual('os').tmpdir();
jest.mock('os', () => ({
  homedir: jest.fn(() => tmpdir),
}));

const roboto = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'Roboto-Regular.ttf'),
);

jest.mock('https', () => ({
  get: jest.fn((url, cb) => {
    cb({
      on: jest.fn((event, cb) => {
        if (event === 'data') {
          cb(roboto);
        } else if (event === 'end') {
          cb();
        }
      }),
    });
  }),
}));

fs.rmdirSync(`${tmpdir}/.mojicon`, { recursive: true });

describe('findFont', () => {
  it('returns default font if not found', async () => {
    const font = await findFont('Unknown', 'Unknown');
    expect(font).toStrictEqual({
      label: 'Roboto-Regular',
      path: `${tmpdir}/.mojicon/fonts/Roboto-Regular.ttf`,
    });
  });

  it('returns matched font with matched variant', async () => {
    const font = await findFont('roboto condensed', 'italic');
    expect(font).toStrictEqual({
      label: 'RobotoCondensed-Italic',
      path: `${tmpdir}/.mojicon/fonts/RobotoCondensed-Italic.ttf`,
    });
  });

  it('returns matched font with default variant', async () => {
    const font = await findFont('roboto condensed', 'unknown');
    expect(font).toStrictEqual({
      label: 'RobotoCondensed-Regular',
      path: `${tmpdir}/.mojicon/fonts/RobotoCondensed-Regular.ttf`,
    });
  });
});
