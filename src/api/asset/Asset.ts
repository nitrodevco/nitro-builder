import { IAsset } from './IAsset';

export class Asset
{
    public key: string;

    public source: string;
    public x: number;
    public y: number;
    public flipH: boolean;
    public flipV: boolean;
    public usesPalette: boolean;

    public static from(key: string, data: IAsset): Asset
    {
        const asset = new Asset();

        asset.key = key;

        if(data.source != undefined) asset.source = data.source;
        if(data.x != undefined) asset.x = data.x;
        if(data.y != undefined) asset.y = data.y;
        if(data.flipH != undefined) asset.flipH = data.flipH;
        if(data.flipV != undefined) asset.flipV = data.flipV;
        if(data.usesPalette != undefined) asset.usesPalette = data.usesPalette;

        return asset;
    }

    public toJSON(): IAsset
    {
        const json: IAsset = {};

        if(this.source != undefined) json.source = this.source;
        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;
        if(this.flipH != undefined) json.flipH = this.flipH;
        if(this.flipV != undefined) json.flipV = this.flipV;
        if(this.usesPalette != undefined) json.usesPalette = this.usesPalette;

        return json;
    }
}
