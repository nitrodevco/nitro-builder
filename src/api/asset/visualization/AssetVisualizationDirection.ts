import { AssetVisualizationLayer } from './AssetVisualizationLayer';
import { IAssetVisualizationDirection } from './IAssetVisualizationDirection';

export class AssetVisualizationDirection
{
    public key: string;

    public layers: AssetVisualizationLayer[];

    public static from(key: string, data: IAssetVisualizationDirection): AssetVisualizationDirection
    {
        const visualizationDirection = new AssetVisualizationDirection();

        visualizationDirection.key = key;

        if(data.layers != undefined)
        {
            const keys = Object.keys(data.layers);

            if(keys.length)
            {
                visualizationDirection.layers = [];

                for(const key of keys) visualizationDirection.layers.push(AssetVisualizationLayer.from(key, data.layers[key]));
            }
        }

        return visualizationDirection;
    }

    public toJSON(): IAssetVisualizationDirection
    {
        const json: IAssetVisualizationDirection = {};

        if(this.layers && this.layers.length)
        {
            json.layers = {};

            this.layers.forEach(layer => json.layers[layer.key] = layer.toJSON());
        }

        return json;
    }
}
