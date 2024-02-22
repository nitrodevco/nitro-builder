import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { IAssetData, NitroBundle } from '../api';
import { CreateSpritesheet } from '../utils';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<IAssetData>(null);
    const [ spritesheet, setSpritesheet ] = useState<Spritesheet>(null);

    const exportBundle = useCallback(async () =>
    {
        if(!spritesheet) return null;

        let textures: Texture[] = [];

        for(const name in spritesheet.textures)
        {
            const texture = spritesheet.textures[name];

            if(!texture) continue;

            textures.push(texture);
        }

        const newSpritesheet = await CreateSpritesheet(textures);

        const newAssetData = { ...assetData };

        newAssetData.spritesheet = newSpritesheet.spritesheetData;

        const bundle = new NitroBundle();

        bundle.addFile(`${ newAssetData.name }.json`, NitroBundle.TEXT_ENCODER.encode(JSON.stringify(newAssetData)));
        bundle.addFile(`${ newAssetData.name }.png`, newSpritesheet.spritesheet as ArrayBuffer);

        const blob = new Blob([ bundle.toBuffer() ], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${ newAssetData.name }.nitro`;
        link.click();
    }, [ spritesheet, assetData ]);

    const importBundle = useCallback(async (file: File) =>
    {
        await new Promise((resolve, reject) =>
        {
            if(!file)
            {
                reject('invalid_file');

                return;
            }

            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.onload = event =>
            {
                const result = event?.target?.result;

                if(!(result instanceof ArrayBuffer))
                {
                    reject('invalid_array_buffer');

                    return;
                }

                (async () =>
                {
                    const bundle = await NitroBundle.from(result);
                    const data = bundle.file;

                    if(!data)
                    {
                        reject('invalid_bundle');

                        return;
                    }

                    setAssetData(bundle.file ?? null);

                    console.log(bundle.file);

                    if(data.spritesheet && Object.keys(data.spritesheet).length)
                    {
                        const spritesheet = new Spritesheet(bundle.texture, data.spritesheet);

                        await spritesheet.parse();

                        setSpritesheet(spritesheet);
                    }

                    resolve(true);
                })();
            }
        });
    }, []);
    

    return { assetData, setAssetData, spritesheet, importBundle, exportBundle };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
