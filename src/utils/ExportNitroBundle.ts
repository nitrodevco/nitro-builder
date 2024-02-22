import { Texture } from 'pixi.js';
import { IAssetData, NitroBundle } from '../api';
import { CreateSpritesheet } from './CreateSpritesheet';

export const ExportNitroBundle = async (name: string, assetData: IAssetData, textures: Texture[]) =>
{
    const newSpritesheet = await CreateSpritesheet(assetData.name, textures);

    assetData = { ...assetData };

    assetData.spritesheet = newSpritesheet.spritesheetData;

    const bundle = new NitroBundle();

    bundle.addFile(`${ name }.json`, NitroBundle.TEXT_ENCODER.encode(JSON.stringify(assetData)));
    bundle.addFile(`${ name }.png`, newSpritesheet.spritesheet as ArrayBuffer);

    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(new Blob([ bundle.toBuffer() ], { type: 'application/octet-stream' }));
    link.download = `${ name }.nitro`;
    
    link.click();
}
