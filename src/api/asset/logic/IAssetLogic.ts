import { IAssetLogicCustomVars } from './IAssetLogicCustomVars';
import { IAssetLogicPlanetSystem } from './IAssetLogicPlanetSystem';
import { IAssetLogicSoundSample } from './IAssetLogicSoundSample';
import { IAssetLogicModel } from './model/IAssetLogicModel';
import { IAssetLogicParticleSystem } from './particlesystem';

export interface IAssetLogic
{
    model?: IAssetLogicModel;
    maskType?: string;
    credits?: string;
    soundSample?: IAssetLogicSoundSample;
    action?: { link?: string, startState?: number };
    planetSystems?: IAssetLogicPlanetSystem[];
    particleSystems?: IAssetLogicParticleSystem[];
    customVars?: IAssetLogicCustomVars;
}
