import { IAssetAnimationSpriteDirection } from './IAssetAnimationSpriteDirection';

export class AssetAnimationSpriteDirection
{
    public id: number;
    public dx: number;
    public dy: number;
    public dz: number;

    public static from(data: IAssetAnimationSpriteDirection): AssetAnimationSpriteDirection
    {
        const assetSpriteDirection = new AssetAnimationSpriteDirection();

        if(data.id != undefined) assetSpriteDirection.id = data.id;
        if(data.dx != undefined) assetSpriteDirection.dx = data.dx;
        if(data.dy != undefined) assetSpriteDirection.dy = data.dy;
        if(data.dz != undefined) assetSpriteDirection.dz = data.dz;

        return assetSpriteDirection;
    }

    public toJSON(): IAssetAnimationSpriteDirection
    {
        const json: IAssetAnimationSpriteDirection = {};

        if(this.id != undefined) json.id = this.id;
        if(this.dx != undefined) json.dx = this.dx;
        if(this.dy != undefined) json.dy = this.dy;
        if(this.dz != undefined) json.dz = this.dz;

        return json;
    }
}
