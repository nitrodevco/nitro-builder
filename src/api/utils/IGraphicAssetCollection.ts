import { Texture } from 'pixi.js';
import { IAssetData } from '../asset/IAssetData';
import { IGraphicAsset } from './IGraphicAsset';
import { IGraphicAssetPalette } from './IGraphicAssetPalette';

export interface IGraphicAssetCollection
{
    dispose(): void;
    define(data: IAssetData): void;
    getAsset(name: string): IGraphicAsset;
    getAssetWithPalette(name: string, paletteName: string): IGraphicAsset;
    getTexture(name: string): Texture;
    getPaletteNames(): string[];
    getPaletteColors(paletteName: string): number[];
    getPalette(name: string): IGraphicAssetPalette;
    addAsset(name: string, texture: Texture, override: boolean, x?: number, y?: number, flipH?: boolean, flipV?: boolean): boolean;
    disposeAsset(name: string): void;
    name: string;
    data: IAssetData;
}
