import { AssetVisualizationAnimationSequenceFrameOffset } from './AssetVisualizationAnimationSequenceFrameOffset';
import { IAssetVisualizationAnimationSequenceFrame } from './IAssetVisualizationAnimationSequenceFrame';

export class AssetVisualizationAnimationSequenceFrame
{
    public key: string;

    public id: number;
    public x: number;
    public y: number;
    public randomX: number;
    public randomY: number;
    public offsets: AssetVisualizationAnimationSequenceFrameOffset[];

    public static from(key: string, data: IAssetVisualizationAnimationSequenceFrame): AssetVisualizationAnimationSequenceFrame
    {
        const animationSequenceFrame = new AssetVisualizationAnimationSequenceFrame();

        animationSequenceFrame.key = key;

        if(data.id != undefined) animationSequenceFrame.id = data.id;
        if(data.x != undefined) animationSequenceFrame.x = data.x;
        if(data.y != undefined) animationSequenceFrame.y = data.y;
        if(data.randomX != undefined) animationSequenceFrame.randomX = data.randomX;
        if(data.randomY != undefined) animationSequenceFrame.randomY = data.randomY;

        if(data.offsets != undefined)
        {
            const keys = Object.keys(data.offsets);

            if(keys.length)
            {
                animationSequenceFrame.offsets = [];

                for(const key of keys) animationSequenceFrame.offsets.push(AssetVisualizationAnimationSequenceFrameOffset.from(key, data.offsets[key]));
            }
        }

        return animationSequenceFrame;
    }

    public toJSON(): IAssetVisualizationAnimationSequenceFrame
    {
        const json: IAssetVisualizationAnimationSequenceFrame = {};

        if(this.id != undefined) json.id = this.id;
        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;
        if(this.randomX != undefined) json.randomX = this.randomX;
        if(this.randomY != undefined) json.randomY = this.randomY;

        if(this.offsets && this.offsets.length)
        {
            json.offsets = {};

            this.offsets.forEach(offset => json.offsets[offset.key] = offset.toJSON());
        }

        return json;
    }
}
