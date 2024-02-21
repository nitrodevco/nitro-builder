import { IFurnitureData } from './IFurnitureData';
import { IProductData } from './IProductData';

export interface ISessionDataManager
{
    init(): Promise<void>;
    getAllFurnitureData(): IFurnitureData[];
    getFloorItemData(id: number): IFurnitureData;
    getFloorItemDataByName(name: string): IFurnitureData;
    getWallItemData(id: number): IFurnitureData;
    getWallItemDataByName(name: string): IFurnitureData;
    getProductData(type: string): IProductData;
    userId: number; 
    userName: string;
    figure: string;
    gender: string;
    isCameraFollowDisabled: boolean;
}
