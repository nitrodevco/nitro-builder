import { IAssetVisualizationAnimationSequence } from './IAssetVisualizationAnimationSequence';

export interface IAssetVisualizationAnimationLayer
{
    loopCount?: number;
    frameRepeat?: number;
    random?: number;
    frameSequences?: { [index: string]: IAssetVisualizationAnimationSequence };
}
