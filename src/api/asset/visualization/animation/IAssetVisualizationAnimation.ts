import { IAssetVisualizationAnimationLayer } from './IAssetVisualizationAnimationLayer';

export interface IAssetVisualizationAnimation
{
    transitionTo?: number;
    transitionFrom?: number;
    immediateChangeFrom?: string;
    randomStart?: boolean;
    layers?: { [index: string]: IAssetVisualizationAnimationLayer };
}
