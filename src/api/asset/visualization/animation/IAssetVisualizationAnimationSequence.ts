import { IAssetVisualizationAnimationSequenceFrame } from './IAssetVisualizationAnimationSequenceFrame';

export interface IAssetVisualizationAnimationSequence
{
    loopCount?: number;
    random?: number;
    frames?: { [index: string]: IAssetVisualizationAnimationSequenceFrame };
}
