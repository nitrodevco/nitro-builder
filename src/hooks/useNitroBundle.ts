import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { Asset, AssetData, ExportNitroBundle, GetAssetManager, IAssetItem, NitroBundle } from '../api';

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<AssetData>(null);
    const [ assets, setAssets ] = useState<({ texture: Texture } & IAssetItem)[]>(null);

    const refreshAssetData = useCallback(() =>
    {
        setAssetData(prevValue => prevValue.clone());
    }, []);

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
                            const newValue: ({ texture: Texture } & IAssetItem)[] = [];

                            Object.keys(newSpritesheet.textures).forEach(key =>
                            {
                                const newAsset: { texture: Texture } & IAssetItem = {
                                    texture: newSpritesheet.textures[key]
                                };

                                const parts = key.split('_');

                                if(key.indexOf('_icon_') >= 0)
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

                                if(newAsset.layerCode === 'sd') newAsset.isShadow = true;

                                newValue.push(newAsset);
                            });

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

        GetAssetManager().createCollection(assetData.toJSON(), assets.map(asset =>
        {
            return { name: `${ assetData.name }_${ Asset.getKeyWithName(assetData.name, asset) }`, texture: asset.texture };
        }));
    }, [ assetData, assets ]);

    return { assetData, setAssetData, assets, setAssets, importBundle, exportBundle, refreshAssetData };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
