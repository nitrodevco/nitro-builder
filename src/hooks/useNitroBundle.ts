import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { AssetData, ExportNitroBundle, GetAssetManager, NitroBundle } from '../api';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<AssetData>(null);
    const [ assets, setAssets ] = useState<{ size?: number, layerCode?: string, direction?: number, frameNumber?: number, isIcon?: boolean, texture: Texture }[]>(null);

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

                    if(!newAssetData)
                    {
                        reject('invalid_bundle');

                        return;
                    }

                    if(bundle.file.spritesheet && Object.keys(bundle.file.spritesheet).length)
                    {
                        const newSpritesheet = new Spritesheet(bundle.texture, bundle.file.spritesheet);

                        await newSpritesheet.parse();

                        setAssets(() =>
                        {
                            const newValue: { size?: number, layerCode?: string, direction?: number, frameNumber?: number, isIcon?: boolean, texture: Texture }[] = [];

                            for(const name in newSpritesheet.textures)
                            {
                                const newAsset: { size?: number, layerCode?: string, direction?: number, frameNumber?: number, isIcon?: boolean, texture: Texture } = {
                                    texture: newSpritesheet.textures[name]
                                };

                                const parts = name.split('_');

                                if(name.indexOf('_icon_') >= 0)
                                {
                                    newAsset.isIcon = true;
                                    newAsset.layerCode = parts[(parts.length - 1)];
                                }
                                else
                                {
                                    newAsset.size = parseInt(parts[(parts.length - 4)]);
                                    newAsset.layerCode = parts[(parts.length - 3)];
                                    newAsset.direction = parseInt(parts[(parts.length - 2)]);
                                    newAsset.frameNumber = parseInt(parts[(parts.length - 1)]);
                                }

                                newValue.push(newAsset);
                            }

                            return newValue;
                        });
                    }

                    delete newAssetData.spritesheet;

                    setAssetData(AssetData.from(newAssetData));

                    resolve(true);
                })();
            }
        });
    }, []);

    const exportBundle = useCallback(async () =>
    {
        if(!assetData) return;

        await ExportNitroBundle(assetData.name, assetData.toJSON(), assets);
    }, [ assetData, assets ]);

    useEffect(() =>
    {
        if(!assetData || !assets) return;

        console.log(assets, assetData);

        GetAssetManager().createCollection(assetData.toJSON(), assets.map(asset =>
        {
            let name: string = assetData.name;

            if(asset.isIcon)
            {
                name = `${ name }_${ name }_icon_${ asset.layerCode }`;
            }
            else
            {
                name = `${ name }_${ name }_${ asset.size }_${ asset.layerCode }_${ asset.direction }_${ asset.frameNumber }`
            }

            return { name, texture: asset.texture };
        }));
    }, [ assetData, assets ]);

    return { assetData, setAssetData, assets, setAssets, importBundle, exportBundle };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
