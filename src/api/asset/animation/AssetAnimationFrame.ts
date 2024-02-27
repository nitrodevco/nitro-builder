import { AssetAnimationFramePart } from './AssetAnimationFramePart';
import { IAssetAnimationFrame } from './IAssetAnimationFrame';
import { IAssetAnimationFramePart } from './IAssetAnimationFramePart';

export class AssetAnimationFrame
{
    public repeats: number;
    public fxs: IAssetAnimationFramePart[];
    public bodyparts: IAssetAnimationFramePart[];

    public static from(data: IAssetAnimationFrame): AssetAnimationFrame
    {
        const assetFrame = new AssetAnimationFrame();

        if(data.repeats != undefined) assetFrame.repeats = data.repeats;

        if(data.fxs != undefined)
        {
            const fxs: IAssetAnimationFramePart[] = [];

            if(Array.isArray(data.fxs) && data.fxs.length)
            {
                for(const fxsData of data.fxs)
                {
                    const fx = AssetAnimationFramePart.from(fxsData);

                    if(fx) fxs.push(fx);
                }
            }

            if(fxs.length) assetFrame.fxs = fxs;
        }

        if(data.bodyparts != undefined)
        {
            const bodyparts: IAssetAnimationFramePart[] = [];

            if(Array.isArray(data.bodyparts) && data.bodyparts.length)
            {
                for(const bodypartData of data.bodyparts)
                {
                    const bodypart = AssetAnimationFramePart.from(bodypartData);

                    if(bodypart) bodyparts.push(bodypart);
                }
            }

            if(bodyparts.length) assetFrame.bodyparts = bodyparts;
        }

        return assetFrame;
    }

    public toJSON(): IAssetAnimationFrame
    {
        const json: IAssetAnimationFrame = {};

        if(this.repeats != undefined) json.repeats = this.repeats;
        if(this.fxs != undefined) json.fxs = this.fxs;
        if(this.bodyparts != undefined) json.bodyparts = this.bodyparts;

        return json;
    }
}
