export interface ItemOptions {
  mode: 'text' | 'icon';
  label: string;
  font: string;
  fontSize: number;
  variant: string;
  x: number;
  y: number;
  angle: number;
}

export interface RenderOptions {
  width: number;
  height: number;
  textColor: string;
  backgroundColor: string;
  backgroundAlpha: number;
  radius: number;
  output: string;
  items: ItemOptions[];
}

export const DEFAULT_TEXT_FONT = 'Roboto';
export const DEFAULT_ICON_FONT = 'Material Icons';

export const DEFAULT_ITEM_OPTIONS: ItemOptions = {
  mode: 'text',
  label: 'A',
  font: DEFAULT_TEXT_FONT,
  fontSize: 256,
  variant: 'Regular',
  x: 0,
  y: 0,
  angle: 0,
};

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  width: 512,
  height: 512,
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  backgroundAlpha: 1.0,
  radius: 0,
  output: './icon.png',
  items: [DEFAULT_ITEM_OPTIONS],
};
