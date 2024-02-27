import { IAsset } from './IAsset';

export class Asset
{
    public isIcon: boolean = false;
    public size: number;
    public layerCode: string;
    public direction: number;
    public frameNumber: number;

    public source: { size?: number, layerCode?: string, direction?: number, frameNumber?: number, isIcon?: boolean };
    public x: number;
    public y: number;
    public flipH: boolean;
    public flipV: boolean;
    public usesPalette: boolean;

    public static from(key: string, data: IAsset): Asset
    {
        const asset = new Asset();

        if(data.source != undefined)
        {
            const parts = data.source.split('_');

            if(key.indexOf('_icon_') >= 0)
            {
                asset.source = { layerCode: parts[(parts.length - 1)], isIcon: true };
            }
            else
            {
                asset.source = { size: parseInt(parts[(parts.length - 4)]), layerCode: parts[(parts.length - 3)], direction: parseInt(parts[(parts.length - 2)]), frameNumber: parseInt(parts[(parts.length - 1)]) };
            }
        }

        if(data.x != undefined) asset.x = data.x;
        if(data.y != undefined) asset.y = data.y;
        if(data.flipH != undefined) asset.flipH = data.flipH;
        if(data.flipV != undefined) asset.flipV = data.flipV;
        if(data.usesPalette != undefined) asset.usesPalette = data.usesPalette;

        const parts = key.split('_');

        if(key.indexOf('_icon_') >= 0)
        {
            asset.isIcon = true;
            asset.layerCode = parts[(parts.length - 1)];
        }
        else
        {
            asset.size = parseInt(parts[(parts.length - 4)]);
            asset.layerCode = parts[(parts.length - 3)];
            asset.direction = parseInt(parts[(parts.length - 2)]);
            asset.frameNumber = parseInt(parts[(parts.length - 1)]);
        }

        return asset;
    }

    public getKeyWithName(name: string): string
    {
        if(this.isIcon) return `${ name }_icon_${ this.layerCode }`;

        return `${ name }_${ this.size }_${ this.layerCode }_${ this.direction }_${ this.frameNumber }`;
    }

    public toJSON(name: string = null): IAsset
    {
        const json: IAsset = {};

        if(this.source != undefined && name != null)
        {
            if(this.source.isIcon)
            {
                json.source = `${ name }_icon_${ this.source.layerCode }`;
            }
            else
            {
                json.source = `${ name }_${ this.source.size }_${ this.source.layerCode }_${ this.source.direction }_${ this.source.frameNumber }`
            }
        }

        if(this.x != undefined) json.x = this.x;
        if(this.y != undefined) json.y = this.y;
        if(this.flipH != undefined) json.flipH = this.flipH;
        if(this.flipV != undefined) json.flipV = this.flipV;
        if(this.usesPalette != undefined) json.usesPalette = this.usesPalette;

        return json;
    }
}
