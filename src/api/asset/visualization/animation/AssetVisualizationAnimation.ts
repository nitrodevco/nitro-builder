import { AssetVisualizationAnimationLayer } from './AssetVisualizationAnimationLayer';
import { IAssetVisualizationAnimation } from './IAssetVisualizationAnimation';

export class AssetVisualizationAnimation
{
    public key: string;

    public transitionTo: number;
    public transitionFrom: number;
    public immediateChangeFrom: string;
    public randomStart: boolean;
    public layers: AssetVisualizationAnimationLayer[];

    public static from(key: string, data: IAssetVisualizationAnimation): AssetVisualizationAnimation
    {
        const visualAnimation = new AssetVisualizationAnimation();

        visualAnimation.key = key;

        if(data.transitionTo != undefined) visualAnimation.transitionTo = data.transitionTo;
        if(data.transitionFrom != undefined) visualAnimation.transitionFrom = data.transitionFrom;
        if(data.immediateChangeFrom != undefined) visualAnimation.immediateChangeFrom = data.immediateChangeFrom;
        if(data.randomStart != undefined) visualAnimation.randomStart = data.randomStart;

        if(data.layers != undefined)
        {
            const keys = Object.keys(data.layers);

            if(keys.length)
            {
                visualAnimation.layers = [];

                for(const key of keys) visualAnimation.layers.push(AssetVisualizationAnimationLayer.from(key, data.layers[key]));
            }
        }

        return visualAnimation;
    }

    public toJSON(): IAssetVisualizationAnimation
    {
        const json: IAssetVisualizationAnimation = {};

        if(this.transitionTo != undefined) json.transitionTo = this.transitionTo;
        if(this.transitionFrom != undefined) json.transitionFrom = this.transitionFrom;
        if(this.immediateChangeFrom != undefined) json.immediateChangeFrom = this.immediateChangeFrom;
        if(this.randomStart != undefined) json.randomStart = this.randomStart;

        if(this.layers && this.layers.length)
        {
            json.layers = {};

            this.layers.forEach(layer => json.layers[layer.key] = layer.toJSON());
        }

        return json;
    }
}
