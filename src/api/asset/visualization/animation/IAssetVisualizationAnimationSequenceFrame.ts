import { IAssetVisualizationAnimationSequenceFrameOffset } from './IAssetVisualizationAnimationSequenceFrameOffset';

export interface IAssetVisualizationAnimationSequenceFrame
{
    id?: number;
    x?: number;
    y?: number;
    randomX?: number;
    randomY?: number;
    offsets?: { [index: string]: IAssetVisualizationAnimationSequenceFrameOffset };
}
