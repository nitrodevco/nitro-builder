import { IAssetAnimationFramePartItem } from './IAssetAnimationFramePartItem';

export class AssetAnimationFramePartItem
{
    public id: string;
    public base: string;

    public static from(data: IAssetAnimationFramePartItem): AssetAnimationFramePartItem
    {
        const assetFramePartItem = new AssetAnimationFramePartItem();

        if(data.id != undefined) assetFramePartItem.id = data.id;
        if(data.base != undefined) assetFramePartItem.base = data.base;

        return assetFramePartItem;
    }

    public toJSON(): IAssetAnimationFramePartItem
    {
        const json: IAssetAnimationFramePartItem = {};

        if(this.id != undefined) json.id = this.id;
        if(this.base != undefined) json.base = this.base;

        return json;
    }
}
