export interface IconOptions {
  output: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundAlpha: number;
  font: string;
  variant: string;
  textColor: string;
  letter: string;
  fontSize: number;
  code: string;
  x: number;
  y: number;
  radius: number;
  angle: number;
}

export const DEFAULT_ICON_OPTIONS: IconOptions = {
  output: './icon.png',
  width: 512,
  height: 512,
  backgroundColor: '#FFFFFF',
  backgroundAlpha: 1.0,
  font: 'Roboto',
  variant: 'Regular',
  textColor: '#000000',
  letter: 'A',
  fontSize: 256,
  code: '',
  x: 0,
  y: 0,
  radius: 0,
  angle: 0,
};

export const DEFAULT_CODE_FONT = 'Material Icons';
