import { Spritesheet, Texture } from 'pixi.js';
import { useCallback, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { AssetData, ExportNitroBundle, IAssetData, IAssetVisualizationData, NitroBundle } from '../api';

const DEFAULT_VISUALIZATION_SIZE = 64;

const useNitroBundleHook = () =>
{
    const [ assetData, setAssetData ] = useState<IAssetData>(null);
    const [ spritesheet, setSpritesheet ] = useState<Spritesheet>(null);
    const [ currentVisualizationSize, setCurrentVisualizationSize ] = useState<number>(DEFAULT_VISUALIZATION_SIZE);

    const getVisualizationSizes = useMemo(() =>
    {
        if(!assetData) return [];

        if(!assetData.visualizations) assetData.visualizations = [];

        return assetData.visualizations.map(visualizations => visualizations.size);
    }, [ assetData ]);

    const getVisualization = useCallback((size: number): IAssetVisualizationData =>
    {
        if(!assetData) return null;

        if(!assetData.visualizations) assetData.visualizations = [];

        let visualization = assetData.visualizations.find(visualization => (visualization.size === size));

        if(!visualization)
        {
            visualization = {};

            assetData.visualizations.push(visualization);
        }

        return visualization;
    }, [ assetData ]);

    const updateVisualization = (visualizationSize: number, data: IAssetVisualizationData) =>
    {
        setAssetData(prevValue =>
        {
            const newValue = { ...prevValue };

            const visualizationIndex = newValue.visualizations.findIndex(visualization => (visualization.size === visualizationSize));

            if(visualizationIndex >= 0) newValue.visualizations[visualizationIndex] = data;

            return newValue;
        });
    }

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

                    const newerAssetData = AssetData.from(newAssetData).toJSON();

                    setAssetData(newerAssetData);
                    setSpritesheet(newSpritesheet)

                    resolve(true);
                })();
            }
        });
    }, []);

    const exportBundle = useCallback(async () =>
    {
        if(!assetData) return;

        const textures: Texture[] = [];

        for(const name in spritesheet.textures) textures.push(spritesheet.textures[name]);

        await ExportNitroBundle(assetData.name, assetData, textures);
    }, [ spritesheet, assetData ]);

    return { assetData, setAssetData, spritesheet, importBundle, exportBundle };
}

export const useNitroBundle = () => useBetween(useNitroBundleHook);
