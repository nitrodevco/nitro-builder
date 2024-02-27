import { AssetLogicParticleSystemParticle } from './AssetLogicParticleSystemParticle';
import { AssetLogicParticleSystemSimulation } from './AssetLogicParticleSystemSimulation';
import { IAssetLogicParticleSystemEmitter } from './IAssetLogicParticleSystemEmitter';

export class AssetLogicParticleSystemEmitter
{
    public id: number;
    public name: string;
    public spriteId: number;
    public maxNumParticles: number;
    public particlesPerFrame: number;
    public burstPulse: number;
    public fuseTime: number;
    public simulation: AssetLogicParticleSystemSimulation;
    public particles: AssetLogicParticleSystemParticle[];

    public static from(data: IAssetLogicParticleSystemEmitter): AssetLogicParticleSystemEmitter
    {
        const emitter = new AssetLogicParticleSystemEmitter();

        if(data.id != undefined) emitter.id = data.id;
        if(data.name != undefined) emitter.name = data.name;
        if(data.spriteId != undefined) emitter.spriteId = data.spriteId;
        if(data.maxNumParticles != undefined) emitter.maxNumParticles = data.maxNumParticles;
        if(data.particlesPerFrame != undefined) emitter.particlesPerFrame = data.particlesPerFrame;
        if(data.burstPulse != undefined) emitter.burstPulse = data.burstPulse;
        if(data.fuseTime != undefined) emitter.fuseTime = data.fuseTime;
        if(data.simulation != undefined) emitter.simulation = AssetLogicParticleSystemSimulation.from(data.simulation);

        if(data.particles != undefined)
        {
            const particles: AssetLogicParticleSystemParticle[] = [];

            if(Array.isArray(data.particles) && data.particles.length)
            {
                for(const particleData of data.particles)
                {
                    const particle = AssetLogicParticleSystemParticle.from(particleData);

                    if(particle) particles.push(particle);
                }
            }

            if(particles.length) emitter.particles = particles;
        }

        return emitter;
    }

    public toJSON(): IAssetLogicParticleSystemEmitter
    {
        const json: IAssetLogicParticleSystemEmitter = {};

        if(this.id != undefined) json.id = this.id;
        if(this.name != undefined) json.name = this.name;
        if(this.spriteId != undefined) json.spriteId = this.spriteId;
        if(this.maxNumParticles != undefined) json.maxNumParticles = this.maxNumParticles;
        if(this.particlesPerFrame != undefined) json.particlesPerFrame = this.particlesPerFrame;
        if(this.burstPulse != undefined) json.burstPulse = this.burstPulse;
        if(this.fuseTime != undefined) json.fuseTime = this.fuseTime;
        if(this.simulation != undefined) json.simulation = this.simulation.toJSON();
        
        if(this.particles != undefined)
        {
            json.particles = [];

            this.particles.forEach(frame => json.particles.push(frame.toJSON()));
        }

        return json;
    }
}
