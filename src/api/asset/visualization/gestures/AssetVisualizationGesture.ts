import { IAssetVisualizationGesture } from './IAssetVisualizationGesture';

export class AssetVisualizationGesture
{
    public id: string;
    public animationId: number;

    public static from(data: IAssetVisualizationGesture): AssetVisualizationGesture
    {
        const gesture = new AssetVisualizationGesture();

        if(data.id != undefined) gesture.id = data.id;
        if(data.animationId != undefined) gesture.animationId = data.animationId;

        return gesture;
    }

    public toJSON(): IAssetVisualizationGesture
    {
        const json: IAssetVisualizationGesture = {};

        if(this.id != undefined) json.id = this.id;
        if(this.animationId != undefined) json.animationId = this.animationId;

        return json;
    }
}
