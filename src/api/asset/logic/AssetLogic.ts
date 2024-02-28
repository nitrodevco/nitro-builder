import { AssetLogicCustomVars } from './AssetLogicCustomVars';
import { AssetLogicPlanetSystem } from './AssetLogicPlanetSystem';
import { AssetLogicSoundSample } from './AssetLogicSoundSample';
import { IAssetLogic } from './IAssetLogic';
import { AssetLogicModel } from './model';
import { AssetLogicParticleSystem } from './particlesystem';

export class AssetLogic
{
    public model: AssetLogicModel;
    public maskType?: string;
    public credits?: string;
    public soundSample?: AssetLogicSoundSample;
    public action?: { link?: string, startState?: number };
    public planetSystems?: AssetLogicPlanetSystem[];
    public particleSystems?: AssetLogicParticleSystem[];
    public customVars?: AssetLogicCustomVars;

    public static from(data: IAssetLogic): AssetLogic
    {
        const assetLogic = new AssetLogic();

        if(data.model != undefined) assetLogic.model = AssetLogicModel.from(data.model);
        if(data.maskType != undefined) assetLogic.maskType = data.maskType;
        if(data.credits != undefined) assetLogic.credits = data.credits;
        if(data.soundSample != undefined) assetLogic.soundSample = AssetLogicSoundSample.from(data.soundSample);
        if(data.action != undefined) assetLogic.action = data.action;

        if(data.planetSystems != undefined)
        {
            const keys = Object.keys(data.planetSystems);

            if(keys.length)
            {
                assetLogic.planetSystems = [];

                for(const key of keys) assetLogic.planetSystems.push(AssetLogicPlanetSystem.from(data.planetSystems[key]));
            }
        }

        if(data.particleSystems != undefined)
        {
            const keys = Object.keys(data.particleSystems);

            if(keys.length)
            {
                assetLogic.particleSystems = [];

                for(const key of keys) assetLogic.particleSystems.push(AssetLogicParticleSystem.from(data.particleSystems[key]));
            }
        }

        if(data.customVars != undefined) assetLogic.customVars = AssetLogicCustomVars.from(data.customVars);

        return assetLogic;
    }

    public toJSON(): IAssetLogic
    {
        const json: IAssetLogic = {};

        if(this.model != undefined) json.model = this.model.toJSON();
        if(this.maskType != undefined) json.maskType = this.maskType;
        if(this.credits != undefined) json.credits = this.credits;
        if(this.soundSample != undefined) json.soundSample = this.soundSample.toJSON();
        if(this.action != undefined) json.action = this.action;

        if(this.planetSystems != undefined)
        {
            json.planetSystems = [];

            this.planetSystems.forEach(planetSystem => json.planetSystems.push(planetSystem.toJSON()));
        }

        if(this.particleSystems != undefined)
        {
            json.particleSystems = [];

            this.particleSystems.forEach(particleSystem => json.particleSystems.push(particleSystem.toJSON()));
        }

        if(this.customVars != undefined) json.customVars = this.customVars.toJSON();

        return json;
    }
}
