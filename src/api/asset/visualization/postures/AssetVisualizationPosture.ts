import { IAssetVisualizationPosture } from './IAssetVisualizationPosture';

export class AssetVisualizationPosture
{
    public id: string;
    public animationId: number;

    public static from(data: IAssetVisualizationPosture): AssetVisualizationPosture
    {
        const posture = new AssetVisualizationPosture();

        if(data.id != undefined) posture.id = data.id;
        if(data.animationId != undefined) posture.animationId = data.animationId;

        return posture;
    }

    public toJSON(): IAssetVisualizationPosture
    {
        const json: IAssetVisualizationPosture = {};

        if(this.id != undefined) json.id = this.id;
        if(this.animationId != undefined) json.animationId = this.animationId;

        return json;
    }
}
