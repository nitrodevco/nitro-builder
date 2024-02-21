import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { GetAssetManager, IAssetData, NitroBundle, TextureUtils } from '../api';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<IAssetData>(null);
    const [ spritesheet, setSpritesheet ] = useState<Spritesheet>(null);
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

                    setAssetData(bundle.file ?? null);

                    if(data.spritesheet && Object.keys(data.spritesheet).length)
                    {
                        const spritesheet = new Spritesheet(bundle.texture, data.spritesheet);

                        await spritesheet.parse();

                        for(const name in spritesheet.textures)
                        {
                            const texture = spritesheet.textures[name];

                            const url = TextureUtils.generateImageUrl(texture);
                        }

                        setTexture(new Texture(spritesheet.textureSource));
                        setSpritesheet(spritesheet);

                        GetAssetManager().createCollection(bundle.file, spritesheet);
                    }

                    resolve(true);
                })();
            }
        });
    }, []);
    

    return { assetData, texture, spritesheet, loadBundleFromFile };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
