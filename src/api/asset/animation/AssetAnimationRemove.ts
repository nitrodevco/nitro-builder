import { IAssetAnimationRemove } from './IAssetAnimationRemove';

export class AssetAnimationRemove
{
    public id: string;

    public static from(data: IAssetAnimationRemove): AssetAnimationRemove
    {
        const assetRemove = new AssetAnimationRemove();

        if(data.id != undefined) assetRemove.id = data.id;

        return assetRemove;
    }

    public toJSON(): IAssetAnimationRemove
    {
        const json: IAssetAnimationRemove = {};

        if(this.id != undefined) json.id = this.id;

        return json;
    }
}
