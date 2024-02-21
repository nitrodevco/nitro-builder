import { IFurnitureData, IProductData, ISessionDataManager } from '../../api';
import { FurnitureDataLoader } from './furniture';
import { ProductDataLoader } from './product';

export class SessionDataManager implements ISessionDataManager
{
    private _userId: number;
    private _name: string;
    private _figure: string;
    private _gender: string;
    private _isRoomCameraFollowDisabled: boolean = false;

    private _floorItems: Map<number, IFurnitureData> = new Map();
    private _wallItems: Map<number, IFurnitureData> = new Map();
    private _products: Map<string, IProductData> = new Map();
    private _furnitureData: FurnitureDataLoader = new FurnitureDataLoader(this._floorItems, this._wallItems);
    private _productData: ProductDataLoader = new ProductDataLoader(this._products);

    constructor()
    {
        this.resetUserInfo();
    }

    public async init(): Promise<void>
    {
        await this._furnitureData.init();
        await this._productData.init();
    }

    private resetUserInfo(): void
    {
        this._userId = 0;
        this._name = null;
        this._figure = null;
        this._gender = null;
    }

    public getAllFurnitureData(): IFurnitureData[]
    {
        return [ ...Array.from(this._floorItems.values()), ...Array.from(this._wallItems.values()) ];
    }

    public getFloorItemData(id: number): IFurnitureData
    {
        const existing = this._floorItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getFloorItemDataByName(name: string): IFurnitureData
    {
        if(!name || !this._floorItems || !this._floorItems.size) return null;

        for(const item of this._floorItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }

        return null;
    }

    public getWallItemData(id: number): IFurnitureData
    {
        const existing = this._wallItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getWallItemDataByName(name: string): IFurnitureData
    {
        if(!name || !this._wallItems || !this._wallItems.size) return null;

        for(const item of this._wallItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }

        return null;
    }

    public getProductData(type: string): IProductData
    {
        return this._products.get(type);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._name;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get isCameraFollowDisabled(): boolean
    {
        return this._isRoomCameraFollowDisabled;
    }
}
