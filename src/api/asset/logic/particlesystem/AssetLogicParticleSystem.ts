import { AssetLogicParticleSystemEmitter } from './AssetLogicParticleSystemEmitter';
import { IAssetLogicParticleSystem } from './IAssetLogicParticleSystem';

export class AssetLogicParticleSystem
{
    public size: number;
    public canvasId: number;
    public offsetY: number;
    public blend: number;
    public bgColor: string;
    public emitters: AssetLogicParticleSystemEmitter[];

    public static from(data: IAssetLogicParticleSystem): AssetLogicParticleSystem
    {
        const particleSystem = new AssetLogicParticleSystem();

        if(data.size != undefined) particleSystem.size = data.size;
        if(data.canvasId != undefined) particleSystem.canvasId = data.canvasId;
        if(data.offsetY != undefined) particleSystem.offsetY = data.offsetY;
        if(data.blend != undefined) particleSystem.blend = data.blend;
        if(data.bgColor != undefined) particleSystem.bgColor = data.bgColor;

        if(data.emitters != undefined)
        {
            const emitters: AssetLogicParticleSystemEmitter[] = [];

            if(Array.isArray(data.emitters) && data.emitters.length)
            {
                for(const emitterData of data.emitters)
                {
                    const emitter = AssetLogicParticleSystemEmitter.from(emitterData);

                    if(emitter) emitters.push(emitter);
                }
            }

            if(emitters.length) particleSystem.emitters = emitters;
        }

        return particleSystem;
    }

    public toJSON(): IAssetLogicParticleSystem
    {
        const json: IAssetLogicParticleSystem = {};

        if(this.size != undefined) json.size = this.size;
        if(this.canvasId != undefined) json.canvasId = this.canvasId;
        if(this.offsetY != undefined) json.offsetY = this.offsetY;
        if(this.blend != undefined) json.blend = this.blend;
        if(this.bgColor != undefined) json.bgColor = this.bgColor;

        if(this.emitters && this.emitters.length)
        {
            json.emitters = [];

            this.emitters.forEach(emitter => json.emitters.push(emitter.toJSON()));
        }

        return json;
    }
}
