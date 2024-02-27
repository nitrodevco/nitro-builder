import { AssetVisualizationAnimationSequenceFrame } from './AssetVisualizationAnimationSequenceFrame';
import { IAssetVisualizationAnimationSequence } from './IAssetVisualizationAnimationSequence';

export class AssetVisualizationAnimationSequence
{
    public key: string;

    public loopCount: number;
    public random: number;
    public frames: AssetVisualizationAnimationSequenceFrame[];

    public static from(key: string, data: IAssetVisualizationAnimationSequence): AssetVisualizationAnimationSequence
    {
        const animationSequence = new AssetVisualizationAnimationSequence();

        animationSequence.key = key;

        if(data.loopCount != undefined) animationSequence.loopCount = data.loopCount;
        if(data.random != undefined) animationSequence.random = data.random;
        if(data.random != undefined) animationSequence.random = data.random;

        if(data.frames != undefined)
        {
            const keys = Object.keys(data.frames);

            if(keys.length)
            {
                animationSequence.frames = [];

                for(const key of keys) animationSequence.frames.push(AssetVisualizationAnimationSequenceFrame.from(key, data.frames[key]));
            }
        }

        return animationSequence;
    }

    public toJSON(): IAssetVisualizationAnimationSequence
    {
        const json: IAssetVisualizationAnimationSequence = {};

        if(this.loopCount != undefined) json.loopCount = this.loopCount;
        if(this.random != undefined) json.random = this.random;

        if(this.frames && this.frames.length)
        {
            json.frames = {};

            this.frames.forEach(frame => json.frames[frame.key] = frame.toJSON());
        }

        return json;
    }
}
