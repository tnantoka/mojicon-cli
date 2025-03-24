export interface ItemOptions {
  letter: string;
  code: string;
  font: string;
  fontSize: number;
  variant: string;
  x: number;
  y: number;
  angle: number;
}

export interface IconOptions {
  output: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundAlpha: number;
  textColor: string;
  radius: number;
  items: ItemOptions[];
}

export const DEFAULT_ITEM_OPTIONS: ItemOptions = {
  letter: 'A',
  code: '',
  font: 'Roboto',
  fontSize: 256,
  variant: 'Regular',
  x: 0,
  y: 0,
  angle: 0,
};

export const DEFAULT_ICON_OPTIONS: IconOptions = {
  output: './icon.png',
  width: 512,
  height: 512,
  backgroundColor: '#FFFFFF',
  backgroundAlpha: 1.0,
  textColor: '#000000',
  radius: 0,
  items: [DEFAULT_ITEM_OPTIONS],
};

export const DEFAULT_CODE_FONT = 'Material Icons';
