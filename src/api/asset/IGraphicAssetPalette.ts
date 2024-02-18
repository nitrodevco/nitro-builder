import { Texture } from 'pixi.js';

export interface IGraphicAssetPalette
{
    dispose: () => void;
    applyPalette(texture: Texture): Texture;
    primaryColor: number;
    secondaryColor: number;
}
