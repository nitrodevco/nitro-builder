import { AssetLogicModelDimension } from './AssetLogicModelDimension';
import { IAssetLogicModel } from './IAssetLogicModel';

export class AssetLogicModel
{
    public dimensions: AssetLogicModelDimension;
    public directions: number[];

    public static from(data: IAssetLogicModel): AssetLogicModel
    {
        const logic = new AssetLogicModel();

        if(data.dimensions != undefined) logic.dimensions = AssetLogicModelDimension.from(data.dimensions);

        if(data.directions != undefined)
        {
            const directions: number[] = [];

            if(Array.isArray(data.directions) && data.directions.length)
            {
                for(const direction of data.directions) directions.push(direction);
            }

            if(directions.length) logic.directions = directions;
        }

        return logic;
    }

    public toJSON(): IAssetLogicModel
    {
        const json: IAssetLogicModel = {};

        if(this.dimensions != undefined) json.dimensions = this.dimensions.toJSON();

        if(this.directions != undefined)
        {
            json.directions = [];

            this.directions.forEach(direction => json.directions.push(direction));
        }

        return json;
    }
}
