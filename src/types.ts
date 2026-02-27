export type LayerType = 'text' | 'rect' | 'circle' | 'image';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width: number;
}

export interface RectLayer extends BaseLayer {
  type: 'rect';
  width: number;
  height: number;
  fill: string;
  cornerRadius: number;
}

export interface CircleLayer extends BaseLayer {
  type: 'circle';
  radius: number;
  fill: string;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type FlyerLayer = TextLayer | RectLayer | CircleLayer | ImageLayer;

export interface FlyerDocument {
  width: number;
  height: number;
  background: string;
  layers: FlyerLayer[];
}
