import { Texture } from 'pixi.js';
import { IAssetData, IAssetItem } from '../asset';
import { CreateSpritesheet } from '../utils';
import { NitroBundle } from './NitroBundle';

export const ExportNitroBundle = async (name: string, assetData: IAssetData, textures: ({ texture: Texture } & IAssetItem)[]) =>
{
    const spritesheet = await CreateSpritesheet(assetData.name, textures);

    assetData = { ...assetData };

    assetData.spritesheet = spritesheet.spritesheetData;

    const bundle = new NitroBundle();

    bundle.addFile(`${ name }.json`, NitroBundle.TEXT_ENCODER.encode(JSON.stringify(assetData)));
    bundle.addFile(`${ name }.png`, spritesheet.spritesheet as ArrayBuffer);

    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(new Blob([ bundle.toBuffer() ], { type: 'application/octet-stream' }));
    link.download = `${ name }.nitro`;
    
    link.click();
}
