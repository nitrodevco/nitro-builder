import { IAssetLogicParticleSystemEmitter } from './IAssetLogicParticleSystemEmitter';

export interface IAssetLogicParticleSystem
{
    size?: number;
    canvasId?: number;
    offsetY?: number;
    blend?: number;
    bgColor?: string;
    emitters?: IAssetLogicParticleSystemEmitter[];
}
