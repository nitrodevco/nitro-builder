import { IAssetLogicPlanetSystem } from './IAssetLogicPlanetSystem';

export class AssetLogicPlanetSystem
{
    public id: number;
    public name: string;
    public parent: string;
    public radius: number;
    public arcSpeed: number;
    public arcOffset: number;
    public blend: number;
    public height: number;

    public static from(data: IAssetLogicPlanetSystem): AssetLogicPlanetSystem
    {
        const planetSystem = new AssetLogicPlanetSystem();

        if(data.id != undefined) planetSystem.id = data.id;
        if(data.name != undefined) planetSystem.name = data.name;
        if(data.parent != undefined) planetSystem.parent = data.parent;
        if(data.radius != undefined) planetSystem.radius = data.radius;
        if(data.arcSpeed != undefined) planetSystem.arcSpeed = data.arcSpeed;
        if(data.arcOffset != undefined) planetSystem.arcOffset = data.arcOffset;
        if(data.blend != undefined) planetSystem.blend = data.blend;
        if(data.height != undefined) planetSystem.height = data.height;

        return planetSystem;
    }

    public toJSON(): IAssetLogicPlanetSystem
    {
        const json: IAssetLogicPlanetSystem = {};

        if(this.id != undefined) json.id = this.id;
        if(this.name != undefined) json.name = this.name;
        if(this.parent != undefined) json.parent = this.parent;
        if(this.radius != undefined) json.radius = this.radius;
        if(this.arcSpeed != undefined) json.arcSpeed = this.arcSpeed;
        if(this.arcOffset != undefined) json.arcOffset = this.arcOffset;
        if(this.blend != undefined) json.blend = this.blend;
        if(this.height != undefined) json.height = this.height;

        return json;
    }
}
