import { Assets, Sprite, Texture } from 'pixi.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { ArrayBufferToBase64, TextureUtils } from '../../../api';
import { useNitroBundle } from '../../../hooks';
import { Badge, Flex, Image, Input } from '../../../layout';

export const TextureEditorItemComponent: FC<{ assetIndex: number }> = props =>
{
    const { assetIndex = -1 } = props;
    const [ textureUrl, setTextureUrl ] = useState<string>('');
    const { assets = null, setAssets = null } = useNitroBundle();

    const asset = useMemo(() =>
    {
        if(assetIndex === -1) return null;

        return assets[assetIndex] ?? null;
    }, [ assetIndex, assets ]);

    const updateAsset = (key: string, value: any) =>
    {
        setAssets(prevValue =>
        {
            if(prevValue[assetIndex] === undefined) return prevValue;

            const newValue = [ ...prevValue ];

            newValue[assetIndex] = { ...newValue[assetIndex ] };
            newValue[assetIndex][key] = value;

            return newValue;
        });
    }

    const updateTexture = (file: File) =>
    {
        if(!file) return;

        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = event =>
        {
            const result = event?.target?.result;

            if(!(result instanceof ArrayBuffer)) return;

            (async () =>
            {
                const texture = await Assets.load<Texture>(`data:image/png;base64,${ ArrayBufferToBase64(result) }`);

                updateAsset('texture', texture);
            })();
        }
    }

    useEffect(() =>
    {
        if(!asset || !asset.texture) return;

        (async () => setTextureUrl(await TextureUtils.generateImageUrl(new Sprite(asset.texture))))();
    }, [ asset ]);

    if(assetIndex === -1) return null;

    return (
        <Flex
            className="justify-center gap-1">
            { textureUrl && textureUrl.length &&
                <Image className="object-none select-none min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px]" src={ textureUrl } /> }
            <Flex
                column
                className="w-full gap-1">
                <Flex
                    className="gap-1">
                    <Badge>size: { asset.isIcon ? 'icon' : asset.size }</Badge>
                    <Badge>layer: { asset.layerCode }</Badge>
                    { !asset.isIcon && <Badge>direction: { asset.direction }</Badge> }
                    { !asset.isIcon && <Badge>frame: { asset.frameNumber }</Badge> }
                </Flex>
                <Flex>
                    <Input
                        type="file"
                        accept=".png"
                        onChange={ event => updateTexture(event?.target?.files?.[0]) } />
                </Flex>
            </Flex>
        </Flex>
    )
}
