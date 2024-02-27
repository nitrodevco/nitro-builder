import { IAssetPalette } from './IAssetPalette';

export class AssetPalette
{
    public key: string;

    public id: number;
    public source: string;
    public master: boolean;
    public tags: string[];
    public breed: number;
    public colorTag: number;
    public color1: string;
    public color2: string;
    public rgb: [ number, number, number ][];

    public static from(key: string, data: IAssetPalette): AssetPalette
    {
        const assetPalette = new AssetPalette();

        assetPalette.key = key;

        if(data.id != undefined) assetPalette.id = data.id;
        if(data.source != undefined) assetPalette.source = data.source;
        if(data.master != undefined) assetPalette.master = data.master;
        if(data.tags != undefined) assetPalette.tags = data.tags;
        if(data.breed != undefined) assetPalette.breed = data.breed;
        if(data.colorTag != undefined) assetPalette.colorTag = data.colorTag;
        if(data.color1 != undefined) assetPalette.color1 = data.color1;
        if(data.color2 != undefined) assetPalette.color2 = data.color2;
        if(data.rgb != undefined) assetPalette.rgb = data.rgb;

        return assetPalette;
    }

    public toJSON(): IAssetPalette
    {
        const json: IAssetPalette = {};

        if(this.id != undefined) json.id = this.id;
        if(this.source != undefined) json.source = this.source;
        if(this.master != undefined) json.master = this.master;
        if(this.tags != undefined) json.tags = this.tags;
        if(this.breed != undefined) json.breed = this.breed;
        if(this.colorTag != undefined) json.colorTag = this.colorTag;
        if(this.color1 != undefined) json.color1 = this.color1;
        if(this.color2 != undefined) json.color2 = this.color2;
        if(this.rgb != undefined) json.rgb = this.rgb;
        
        return json;
    }
}
