import { IAssetLogicParticleSystemParticle } from './IAssetLogicParticleSystemParticle';

export class AssetLogicParticleSystemParticle
{
    public isEmitter: boolean;
    public lifeTime: number;
    public fade: boolean;
    public frames: string[];

    public static from(data: IAssetLogicParticleSystemParticle): AssetLogicParticleSystemParticle
    {
        const particle = new AssetLogicParticleSystemParticle();

        if(data.isEmitter != undefined) particle.isEmitter = data.isEmitter;
        if(data.lifeTime != undefined) particle.lifeTime = data.lifeTime;
        if(data.fade != undefined) particle.fade = data.fade;
        if(data.frames != undefined) particle.frames = data.frames;

        return particle;
    }

    public toJSON(): IAssetLogicParticleSystemParticle
    {
        const json: IAssetLogicParticleSystemParticle = {};

        if(this.isEmitter != undefined) json.isEmitter = this.isEmitter;
        if(this.lifeTime != undefined) json.lifeTime = this.lifeTime;
        if(this.fade != undefined) json.fade = this.fade;
        
        if(this.frames != undefined)
        {
            json.frames = [];

            this.frames.forEach(frame => json.frames.push(frame));
        }

        return json;
    }
}
