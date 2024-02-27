import { AssetVisualizationAnimationSequence } from './AssetVisualizationAnimationSequence';
import { IAssetVisualizationAnimationLayer } from './IAssetVisualizationAnimationLayer';

export class AssetVisualizationAnimationLayer
{
    public key: string;

    public loopCount: number;
    public frameRepeat: number;
    public random: number;
    public frameSequences: AssetVisualizationAnimationSequence[];

    public static from(key: string, data: IAssetVisualizationAnimationLayer): AssetVisualizationAnimationLayer
    {
        const animationLayer = new AssetVisualizationAnimationLayer();

        animationLayer.key = key;

        if(data.loopCount != undefined) animationLayer.loopCount = data.loopCount;
        if(data.frameRepeat != undefined) animationLayer.frameRepeat = data.frameRepeat;
        if(data.random != undefined) animationLayer.random = data.random;

        if(data.frameSequences != undefined)
        {
            const keys = Object.keys(data.frameSequences);

            if(keys.length)
            {
                animationLayer.frameSequences = [];

                for(const key of keys) animationLayer.frameSequences.push(AssetVisualizationAnimationSequence.from(key, data.frameSequences[key]));
            }
        }

        return animationLayer;
    }

    public toJSON(): IAssetVisualizationAnimationLayer
    {
        const json: IAssetVisualizationAnimationLayer = {};

        if(this.loopCount != undefined) json.loopCount = this.loopCount;
        if(this.frameRepeat != undefined) json.frameRepeat = this.frameRepeat;
        if(this.random != undefined) json.random = this.random;

        if(this.frameSequences && this.frameSequences.length)
        {
            json.frameSequences = {};

            this.frameSequences.forEach(sequence => json.frameSequences[sequence.key] = sequence.toJSON());
        }

        return json;
    }
}
