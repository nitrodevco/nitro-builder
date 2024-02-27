import { IAssetLogicParticleSystemParticle } from './IAssetLogicParticleSystemParticle';
import { IAssetParticleSystemSimulation } from './IAssetParticleSystemSimulation';

export interface IAssetLogicParticleSystemEmitter
{
    id?: number;
    name?: string;
    spriteId?: number;
    maxNumParticles?: number;
    particlesPerFrame?: number;
    burstPulse?: number;
    fuseTime?: number;
    simulation?: IAssetParticleSystemSimulation;
    particles?: IAssetLogicParticleSystemParticle[];
}
