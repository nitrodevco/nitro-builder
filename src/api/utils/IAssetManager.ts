import { Spritesheet, Texture } from 'pixi.js';
import { IAssetData, IGraphicAsset, IGraphicAssetCollection } from '../asset';

export interface IAssetManager
{
    getTexture(name: string): Texture;
    setTexture(name: string, texture: Texture): void;
    getAsset(name: string): IGraphicAsset;
    getCollection(name: string): IGraphicAssetCollection;
    getImage(name: string): Texture;
    createCollection(data: IAssetData, spritesheet: Spritesheet): IGraphicAssetCollection;
    processAsset(texture: Texture, data: IAssetData): Promise<void>;
    downloadAsset(url: string): Promise<boolean>;
    collections: Map<string, IGraphicAssetCollection>;
}
