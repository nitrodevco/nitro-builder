import { IAssetVisualizationColorLayer } from './IAssetVisualizationColorLayer';

export interface IAssetVisualizationColor
{
    layers?: { [index: string]: IAssetVisualizationColorLayer };
}
