import { Texture } from 'pixi.js';
import { IAssetData } from '../asset';
import { IGraphicAsset } from './IGraphicAsset';
import { IGraphicAssetCollection } from './IGraphicAssetCollection';

export interface IAssetManager
{
    getTexture(name: string): Texture;
    setTexture(name: string, texture: Texture): void;
    getAsset(name: string): IGraphicAsset;
    getCollection(name: string): IGraphicAssetCollection;
    getImage(name: string): Texture;
    createCollection(data: IAssetData, assets: { name: string, texture: Texture }[]): IGraphicAssetCollection;
    processAsset(texture: Texture, data: IAssetData): Promise<void>;
    downloadAsset(url: string): Promise<boolean>;
    collections: Map<string, IGraphicAssetCollection>;
}
