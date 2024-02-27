import { AssetAnimationFramePartItem } from './AssetAnimationFramePartItem';
import { IAssetAnimationFramePart } from './IAssetAnimationFramePart';
import { IAssetAnimationFramePartItem } from './IAssetAnimationFramePartItem';

export class AssetAnimationFramePart
{
    public id: string;
    public frame: number;
    public base: string;
    public action: string;
    public dx: number;
    public dy: number;
    public dz: number;
    public dd: number;
    public items: IAssetAnimationFramePartItem[];

    public static from(data: IAssetAnimationFramePart): AssetAnimationFramePart
    {
        const assetFramePart = new AssetAnimationFramePart();

        if(data.id != undefined) assetFramePart.id = data.id;
        if(data.frame != undefined) assetFramePart.frame = data.frame;
        if(data.base != undefined) assetFramePart.base = data.base;
        if(data.action != undefined) assetFramePart.action = data.action;
        if(data.dx != undefined) assetFramePart.dx = data.dx;
        if(data.dy != undefined) assetFramePart.dy = data.dy;
        if(data.dz != undefined) assetFramePart.dz = data.dz;
        if(data.dd != undefined) assetFramePart.dd = data.dd;

        if(data.items != undefined)
        {
            const items: IAssetAnimationFramePartItem[] = [];

            if(Array.isArray(data.items) && data.items.length)
            {
                for(const itemData of data.items)
                {
                    const item = AssetAnimationFramePartItem.from(itemData);

                    if(item) items.push(item);
                }
            }

            if(items.length) assetFramePart.items = items;
        }

        return assetFramePart;
    }

    public toJSON(): IAssetAnimationFramePart
    {
        const json: IAssetAnimationFramePart = {};

        if(this.id != undefined) json.id = this.id;
        if(this.frame != undefined) json.frame = this.frame;
        if(this.base != undefined) json.base = this.base;
        if(this.action != undefined) json.action = this.action;
        if(this.dx != undefined) json.dx = this.dx;
        if(this.dy != undefined) json.dy = this.dy;
        if(this.dz != undefined) json.dz = this.dz;
        if(this.id != undefined) json.id = this.id;
        if(this.items != undefined) json.items = this.items;

        return json;
    }
}
