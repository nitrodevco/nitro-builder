import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { IAssetData, NitroBundle } from '../api';
import { ExportNitroBundle } from '../utils';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<IAssetData>(null);
    const [ spritesheet, setSpritesheet ] = useState<Spritesheet>(null);

    const exportBundle = useCallback(async () =>
    {
        if(!assetData) return;

        const textures: Texture[] = [];

        for(const name in spritesheet.textures) textures.push(spritesheet.textures[name]);

        await ExportNitroBundle(assetData.name, assetData, textures);
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
                    const newAssetData = bundle.file;

                    let newSpritesheet: Spritesheet = null;

                    if(!newAssetData)
                    {
                        reject('invalid_bundle');

                        return;
                    }

                    if(newAssetData.spritesheet && Object.keys(newAssetData.spritesheet).length)
                    {
                        newSpritesheet = new Spritesheet(bundle.texture, newAssetData.spritesheet);

                        await newSpritesheet.parse();
                    }

                    setAssetData(newAssetData);
                    setSpritesheet(newSpritesheet)

                    resolve(true);
                })();
            }
        });
    }, []);
    

    return { assetData, setAssetData, spritesheet, importBundle, exportBundle };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
