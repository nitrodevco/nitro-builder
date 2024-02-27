import { IAssetLogicModelDimension } from './IAssetLogicModelDimension';

export interface IAssetLogicModel
{
    dimensions?: IAssetLogicModelDimension;
    directions?: number[];
}
