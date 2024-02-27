import { IAssetVisualizationColorLayer } from './IAssetVisualizationColorLayer';

export class AssetVisualizationColorLayer
{
    public key: string;

    public color: number;

    public static from(key: string, data: IAssetVisualizationColorLayer): AssetVisualizationColorLayer
    {
        const colorLayer = new AssetVisualizationColorLayer();

        colorLayer.key = key;

        if(data.color != undefined) colorLayer.color = data.color;

        return colorLayer;
    }

    public toJSON(): IAssetVisualizationColorLayer
    {
        const json: IAssetVisualizationColorLayer = {};

        if(this.color != undefined) json.color = this.color;

        return json;
    }
}
