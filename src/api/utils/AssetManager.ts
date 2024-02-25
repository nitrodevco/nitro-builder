import { Assets, Spritesheet, SpritesheetData, Texture } from 'pixi.js';
import { GraphicAssetCollection, IAssetData, IGraphicAsset, IGraphicAssetCollection } from '../asset';
import { NitroBundle } from '../bundle';
import { ArrayBufferToBase64 } from './ArrayBufferToBase64';
import { IAssetManager } from './IAssetManager';

export class AssetManager implements IAssetManager
{
    private _textures: Map<string, Texture> = new Map();
    private _collections: Map<string, IGraphicAssetCollection> = new Map();
    private _images: Map<string, Texture> = new Map();

    public getTexture(name: string): Texture
    {
        if(!name) return null;

        const existing = this._textures.get(name);

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: Texture): void
    {
        if(!name || !texture) return;

        texture.source.scaleMode = 'nearest';

        this._textures.set(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(const collection of this._collections.values())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        return null;
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing) return null;

        return existing;
    }

    public getImage(name: string): Texture
    {
        if(!name) return null;

        const existing = this._images.get(name);

        if(!existing) return null;

        return existing;
    }

    public createCollection(data: IAssetData, spritesheet: Spritesheet): IGraphicAssetCollection
    {
        if(!data) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        if(collection)
        {
            for(const [ name, texture ] of collection.textures.entries()) this.setTexture(name, texture);

            this._collections.set(collection.name, collection);
        }

        return collection;
    }

    public async processAsset(texture: Texture, data: IAssetData): Promise<void>
    {
        let spritesheet: Spritesheet<SpritesheetData> = null;

        if(texture && data?.spritesheet && Object.keys(data.spritesheet).length)
        {
            spritesheet = new Spritesheet(texture, data.spritesheet);

            await spritesheet.parse();
        }

        this.createCollection(data, spritesheet);
    }

    public async downloadAsset(url: string): Promise<boolean>
    {
        try
        {
            const response = await fetch(url);
            
            if(response.status !== 200) return;

            let contentType = response.headers.get('Content-Type');

            if(!contentType || !contentType.length) contentType = 'application/octet-stream';

            switch(contentType)
            {
                case 'application/octet-stream': {
                    const buffer = await response.arrayBuffer();
                    const nitroBundle = await NitroBundle.from(buffer);

                    await this.processAsset(
                        nitroBundle.texture,
                        nitroBundle.file as IAssetData
                    );
                    break;
                }
                case 'image/png':
                case 'image/jpeg': {
                    const buffer = await response.arrayBuffer();
                    const base64 = ArrayBufferToBase64(buffer);
                    const texture = await Assets.load(`data:${ contentType };base64,${ base64 }`);

                    this.setTexture(url, texture);
                }
            }

            return Promise.resolve(true);
        }

        catch (err)
        {
            console.error(err);

            return Promise.resolve(false);
        }
    }

    public get collections(): Map<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
