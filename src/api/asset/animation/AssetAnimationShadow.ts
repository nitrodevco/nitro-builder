import { IAssetAnimationShadow } from './IAssetAnimationShadow';

export class AssetAnimationShadow
{
    public id: string;

    public static from(data: IAssetAnimationShadow): AssetAnimationShadow
    {
        const assetShadow = new AssetAnimationShadow();

        if(data.id != undefined) assetShadow.id = data.id;

        return assetShadow;
    }

    public toJSON(): IAssetAnimationShadow
    {
        const json: IAssetAnimationShadow = {};

        if(this.id != undefined) json.id = this.id;

        return json;
    }
}
