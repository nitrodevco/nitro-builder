import { IAssetVisualizationAnimationSequenceFrameOffset } from './IAssetVisualizationAnimationSequenceFrameOffset';

export class AssetVisualizationAnimationSequenceFrameOffset
{
    public key: string;

    public direction: number;
    public x: number;
    public y: number;

    public static from(key: string, data: IAssetVisualizationAnimationSequenceFrameOffset): AssetVisualizationAnimationSequenceFrameOffset
    {
        const animationSequenceFrameOffset = new AssetVisualizationAnimationSequenceFrameOffset();

        animationSequenceFrameOffset.key = key;

        if(data.direction != undefined) animationSequenceFrameOffset.direction = data.direction;
        if(data.x != undefined) animationSequenceFrameOffset.x = data.x;
        if(data.y != undefined) animationSequenceFrameOffset.y = data.y;

        return animationSequenceFrameOffset;
    }

    public toJSON(): IAssetVisualizationAnimationSequenceFrameOffset
    {
        const json: IAssetVisualizationAnimationSequenceFrameOffset = {};

        if(this.direction != undefined) json.direction = this.direction;
        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;

        return json;
    }
}
