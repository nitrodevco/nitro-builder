import { IAssetVisualizationLayer } from './IAssetVisualizationLayer';

export class AssetVisualizationLayer
{
    public key: string;

    public x: number;
    public y: number;
    public z: number;
    public alpha: number;
    public ink: string;
    public tag: string;
    public ignoreMouse: boolean;

    public static from(key: string, data: IAssetVisualizationLayer): AssetVisualizationLayer
    {
        const visualizationLayer = new AssetVisualizationLayer();

        visualizationLayer.key = key;

        if(data.x != undefined) visualizationLayer.x = data.x;
        if(data.y != undefined) visualizationLayer.y = data.y;
        if(data.z != undefined) visualizationLayer.z = data.z;
        if(data.alpha != undefined) visualizationLayer.alpha = data.alpha;
        if(data.ink != undefined) visualizationLayer.ink = data.ink;
        if(data.tag != undefined) visualizationLayer.tag = data.tag;
        if(data.ignoreMouse != undefined) visualizationLayer.ignoreMouse = data.ignoreMouse;

        return visualizationLayer;
    }

    public toJSON(): IAssetVisualizationLayer
    {
        const json: IAssetVisualizationLayer = {};

        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;
        if(this.z != undefined) json.z = this.z;
        if(this.alpha != undefined) json.alpha = this.alpha;
        if(this.ink != undefined) json.ink = this.ink;
        if(this.tag != undefined) json.tag = this.tag;
        if(this.ignoreMouse != undefined) json.ignoreMouse = this.ignoreMouse;

        return json;
    }
}
