import { AssetAnimationFrame } from './AssetAnimationFrame';
import { IAssetAnimationFrame } from './IAssetAnimationFrame';
import { IAssetAnimationOverride } from './IAssetAnimationOverride';

export class AssetAnimationOverride
{
    public name: string;
    public override: string;
    public frames: IAssetAnimationFrame[];

    public static from(data: IAssetAnimationOverride): AssetAnimationOverride
    {
        const assetOverride = new AssetAnimationOverride();

        if(data.name != undefined) assetOverride.name = data.name;
        if(data.override != undefined) assetOverride.override = data.override;

        if(data.frames != undefined)
        {
            const frames: IAssetAnimationFrame[] = [];

            if(Array.isArray(data.frames) && data.frames.length)
            {
                for(const frameData of data.frames)
                {
                    const frame = AssetAnimationFrame.from(frameData);

                    if(frame) frames.push(frame);
                }
            }

            if(frames.length) assetOverride.frames = frames;
        }

        return assetOverride;
    }

    public toJSON(): IAssetAnimationOverride
    {
        const json: IAssetAnimationOverride = {};

        if(this.name != undefined) json.name = this.name;
        if(this.override != undefined) json.override = this.override;
        if(this.frames != undefined) json.frames = this.frames;

        return json;
    }
}
