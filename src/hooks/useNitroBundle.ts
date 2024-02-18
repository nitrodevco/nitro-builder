import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { IAssetData, NitroBundle } from '../api';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<IAssetData>({});
    const [ texture, setTexture ] = useState<Texture>(null);

    const loadBundleFromFile = useCallback(async (file: File) =>
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

                    console.log(bundle.file);

                    setAssetData(bundle.file ?? null);

                    if(data.spritesheet && Object.keys(data.spritesheet).length)
                    {
                        const spritesheet = new Spritesheet(bundle.texture, data.spritesheet);

                        await spritesheet.parse();

                        for(const name in spritesheet.textures)
                        {
                            const texture = spritesheet.textures[name];

                            console.log(texture);
                        }
                    }

                    resolve(true);
                })();
            }
        });
    }, []);

    return { assetData, texture, loadBundleFromFile };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
