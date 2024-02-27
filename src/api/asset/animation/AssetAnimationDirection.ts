import { IAssetAnimationDirection } from './IAssetAnimationDirection';

export class AssetAnimationDirection
{
    public offset: number;

    public static from(data: IAssetAnimationDirection): AssetAnimationDirection
    {
        const assetDirection = new AssetAnimationDirection();

        if(data.offset != undefined) assetDirection.offset = data.offset;

        return assetDirection;
    }

    public toJSON(): IAssetAnimationDirection
    {
        const json: IAssetAnimationDirection = {};

        if(this.offset != undefined) json.offset = this.offset;

        return json;
    }
}
