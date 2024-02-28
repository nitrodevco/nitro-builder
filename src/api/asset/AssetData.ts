import { Asset } from './Asset';
import { AssetAlias } from './AssetAlias';
import { AssetPalette } from './AssetPalette';
import { IAssetData } from './IAssetData';
import { AssetAnimation } from './animation';
import { AssetLogic } from './logic';
import { ISpritesheetData } from './spritesheet';
import { AssetVisualization } from './visualization';

export class AssetData
{
    public type: string;
    public name: string;
    public visualizationType: string;
    public logicType: string;
    public spritesheet: ISpritesheetData;
    public logic: AssetLogic;
    public assets: Asset[];
    public aliases: AssetAlias[];
    public animations: AssetAnimation[];
    public palettes: AssetPalette[];
    public visualizations: AssetVisualization[];

    public clone(): AssetData
    {
        const assetData = new AssetData();

        assetData.type = this.type;
        assetData.name = this.name;
        assetData.visualizationType = this.visualizationType;
        assetData.logicType = this.logicType;
        assetData.spritesheet = this.spritesheet;
        assetData.logic = this.logic;
        assetData.assets = this.assets;
        assetData.aliases = this.aliases;
        assetData.animations = this.animations;
        assetData.palettes = this.palettes;
        assetData.visualizations = this.visualizations;

        return assetData;
    }

    public static from(data: IAssetData): AssetData
    {
        const assetData = new AssetData();

        if(data.type != undefined) assetData.type = data.type;
        if(data.name != undefined) assetData.name = data.name;
        if(data.visualizationType != undefined) assetData.visualizationType = data.visualizationType;
        if(data.logicType != undefined) assetData.logicType = data.logicType;
        if(data.spritesheet != undefined) assetData.spritesheet = data.spritesheet;
        if(data.logic != undefined) assetData.logic = AssetLogic.from(data.logic);

        if(data.assets != undefined)
        {
            const keys = Object.keys(data.assets);

            if(keys.length)
            {
                assetData.assets = [];

                for(const key of keys) assetData.assets.push(Asset.from(key, data.assets[key]));
            }
        }

        if(data.aliases != undefined)
        {
            const keys = Object.keys(data.aliases);

            if(keys.length)
            {
                assetData.aliases = [];

                for(const key of keys) assetData.aliases.push(AssetAlias.from(key, data.aliases[key]));
            }
        }

        if(data.animations != undefined)
        {
            const keys = Object.keys(data.animations);

            if(keys.length)
            {
                assetData.animations = [];

                for(const key of keys) assetData.animations.push(AssetAnimation.from(key, data.animations[key]));
            }
        }

        if(data.palettes != undefined)
        {
            const keys = Object.keys(data.palettes);

            if(keys.length)
            {
                assetData.palettes = [];

                for(const key of keys) assetData.palettes.push(AssetPalette.from(key, data.palettes[key]));
            }
        }

        if(data.visualizations != undefined)
        {
            const keys = Object.keys(data.visualizations);

            if(keys.length)
            {
                assetData.visualizations = [];

                for(const key of keys) assetData.visualizations.push(AssetVisualization.from(data.visualizations[key]));
            }
        }

        return assetData;
    }

    public toJSON(): IAssetData
    {
        const json: IAssetData = {};

        if(this.type != undefined) json.type = this.type;
        if(this.name != undefined) json.name = this.name;
        if(this.visualizationType != undefined) json.visualizationType = this.visualizationType;
        if(this.logicType != undefined) json.logicType = this.logicType;
        if(this.spritesheet != undefined) json.spritesheet = this.spritesheet;
        if(this.logic != undefined) json.logic = this.logic.toJSON();

        if(this.assets && this.assets.length)
        {
            json.assets = {};

            this.assets.forEach(asset => json.assets[Asset.getKeyWithName(this.name, asset)] = asset.toJSON(this.name));
        }

        if(this.aliases && this.aliases.length)
        {
            json.aliases = {};

            this.aliases.forEach(alias => json.aliases[alias.key] = alias.toJSON());
        }

        if(this.animations && this.animations.length)
        {
            json.animations = {};

            this.animations.forEach(alias => json.animations[alias.key] = alias.toJSON());
        }

        if(this.palettes && this.palettes.length)
        {
            json.palettes = {};

            this.palettes.forEach(palette => json.palettes[palette.key] = palette.toJSON());
        }

        if(this.visualizations && this.visualizations.length)
        {
            json.visualizations = [];

            this.visualizations.forEach(visualization => json.visualizations.push(visualization.toJSON()));
        }

        return json;
    }
}
