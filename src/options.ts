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
};
