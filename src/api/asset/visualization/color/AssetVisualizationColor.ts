import { AssetVisualizationColorLayer } from './AssetVisualizationColorLayer';
import { IAssetVisualizationColor } from './IAssetVisualizationColor';

export class AssetVisualizationColor
{
    public key: string;

    public layers: AssetVisualizationColorLayer[];

    public static from(key: string, data: IAssetVisualizationColor): AssetVisualizationColor
    {
        const colorLayer = new AssetVisualizationColor();

        colorLayer.key = key;

        if(data.layers != undefined)
        {
            const keys = Object.keys(data.layers);

            if(keys.length)
            {
                colorLayer.layers = [];

                for(const key of keys) colorLayer.layers.push(AssetVisualizationColorLayer.from(key, data.layers[key]));
            }
        }

        return colorLayer;
    }

    public toJSON(): IAssetVisualizationColor
    {
        const json: IAssetVisualizationColor = {};

        if(this.layers && this.layers.length)
        {
            json.layers = {};

            this.layers.forEach(layer => json.layers[layer.key] = layer.toJSON());
        }

        return json;
    }
}
