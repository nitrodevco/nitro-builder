import { Spritesheet, Texture } from 'pixi.js';
import { GraphicAssetCollection, IAssetData, IGraphicAssetCollection } from '../../asset';
import { IFurnitureData } from '../session';
import { IPetColorResult } from './IPetColorResult';
import { IRoomObject } from './object';

export interface IRoomContentLoader
{
    init(): Promise<void>;
    isLoaderType(type: string): boolean;
    createCollection(data: IAssetData, spritesheet: Spritesheet): GraphicAssetCollection;
    processFurnitureData(furnitureData: IFurnitureData[]): void;
    getCollection(name: string): IGraphicAssetCollection;
    getPlaceholderName(type: string): string;
    getCategoryForType(type: string): number;
    setRoomObjectRoomId(object: IRoomObject, roomId: string): void;
    getFurnitureFloorNameForTypeId(typeId: number): string;
    getFurnitureWallNameForTypeId(typeId: number, extra?: string): string;
    getFurnitureFloorColorIndex(typeId: number): number;
    getFurnitureWallColorIndex(typeId: number): number;
    getImage(name: string): Texture;
    addAssetToCollection(collectionName: string, assetName: string, texture: Texture, override?: boolean): boolean;
    getPetNameForType(type: number): string;
    getPetColorResult(petIndex: number, paletteIndex: number): IPetColorResult;
    getPetColorResultsForTag(petIndex: number, tagName: string): IPetColorResult[];
}
