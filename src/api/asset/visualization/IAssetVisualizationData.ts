import { IAssetVisualizationAnimation } from './animation/IAssetVisualizationAnimation';
import { IAssetVisualizationColor } from './color/IAssetVisualizationColor';
import { IAssetVisualizationGesture } from './gestures/IAssetVisualizationGesture';
import { IAssetVisualizationDirection } from './IAssetVisualizationDirection';
import { IAssetVisualizationLayer } from './IAssetVisualizationLayer';
import { IAssetVisualizationPosture } from './postures/IAssetVisualizationPosture';

export interface IAssetVisualizationData
{
    size?: number;
    layerCount?: number;
    angle?: number;
    layers?: { [index: string]: IAssetVisualizationLayer };
    colors?: { [index: string]: IAssetVisualizationColor };
    directions?: { [index: string]: IAssetVisualizationDirection };
    animations?: { [index: string]: IAssetVisualizationAnimation };
    defaultPosture?: string;
    postures?: { defaultPosture?: string, postures?: IAssetVisualizationPosture[] };
    gestures?: IAssetVisualizationGesture[];
}
