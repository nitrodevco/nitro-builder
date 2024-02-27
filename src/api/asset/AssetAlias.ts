import { IAssetAlias } from './IAssetAlias';

export class AssetAlias
{
    public key: string;

    public link: string;
    public flipH: boolean;
    public flipV: boolean;

    public static from(key: string, data: IAssetAlias): AssetAlias
    {
        const assetAlias = new AssetAlias();

        assetAlias.key = key;

        if(data.link != undefined) assetAlias.link = data.link;
        if(data.flipH != undefined) assetAlias.flipH = data.flipH;
        if(data.flipV != undefined) assetAlias.flipV = data.flipV;

        return assetAlias;
    }

    public toJSON(): IAssetAlias
    {
        const json: IAssetAlias = {};

        if(this.link != undefined) json.link = this.link;
        if(this.flipH != undefined) json.flipH = this.flipH;
        if(this.flipV != undefined) json.flipV = this.flipV;
        
        return json;
    }
}
