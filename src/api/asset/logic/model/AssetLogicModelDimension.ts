import { IAssetLogicModelDimension } from './IAssetLogicModelDimension';

export class AssetLogicModelDimension
{
    public x: number;
    public y: number;
    public z: number;
    public centerZ: number;

    public static from(data: IAssetLogicModelDimension): AssetLogicModelDimension
    {
        const dimension = new AssetLogicModelDimension();

        if(data.x != undefined) dimension.x = data.x;
        if(data.y != undefined) dimension.y = data.y;
        if(data.z != undefined) dimension.z = data.z;
        if(data.centerZ != undefined) dimension.centerZ = data.centerZ;

        return dimension;
    }

    public toJSON(): IAssetLogicModelDimension
    {
        const json: IAssetLogicModelDimension = {};

        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;
        if(this.z != undefined) json.z = this.z;
        if(this.centerZ != undefined) json.centerZ = this.centerZ;

        return json;
    }
}
