import { IAssetParticleSystemSimulation } from './IAssetParticleSystemSimulation';

export class AssetLogicParticleSystemSimulation
{
    public force: number;
    public direction: number;
    public gravity: number;
    public airFriction: number;
    public shape: string;
    public energy: number;

    public static from(data: IAssetParticleSystemSimulation): AssetLogicParticleSystemSimulation
    {
        const simulation = new AssetLogicParticleSystemSimulation();

        if(data.force != undefined) simulation.force = data.force;
        if(data.direction != undefined) simulation.direction = data.direction;
        if(data.gravity != undefined) simulation.gravity = data.gravity;
        if(data.airFriction != undefined) simulation.airFriction = data.airFriction;
        if(data.shape != undefined) simulation.shape = data.shape;
        if(data.energy != undefined) simulation.energy = data.energy;

        return simulation;
    }

    public toJSON(): IAssetParticleSystemSimulation
    {
        const json: IAssetParticleSystemSimulation = {};

        if(this.force != undefined) json.force = this.force;
        if(this.direction != undefined) json.direction = this.direction;
        if(this.gravity != undefined) json.gravity = this.gravity;
        if(this.airFriction != undefined) json.airFriction = this.airFriction;
        if(this.shape != undefined) json.shape = this.shape;
        if(this.energy != undefined) json.energy = this.energy;

        return json;
    }
}
