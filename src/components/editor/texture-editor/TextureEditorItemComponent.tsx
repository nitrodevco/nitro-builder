import { Assets, Sprite, Texture } from 'pixi.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { ArrayBufferToBase64, LetterToNumber, TextureUtils } from '../../../api';
import { useLanguage, useNitroBundle } from '../../../hooks';
import { Badge, Flex, Image, Input } from '../../../layout';

export const TextureEditorItemComponent: FC<{ textureAssetIndex: number }> = props =>
{
    const { textureAssetIndex = -1 } = props;
    const [ textureUrl, setTextureUrl ] = useState<string>('');
    const { assets = null, setAssets = null } = useNitroBundle();
    const { localizeText = null } = useLanguage();

    const [ assetSize, setAssetSize ] = useState<number>(null);
    const [ assetLayerCode, setAssetLayerCode ] = useState<string>(null);
    const [ assetDirection, setAssetDirection ] = useState<number>(null);
    const [ assetFrameNumber, setAssetFrameNumber ] = useState<number>(null);
    const [ assetIsIcon, setAssetIsIcon ] = useState<boolean>(false);

    const asset = useMemo(() =>
    {
        if(textureAssetIndex === -1) return null;

        return assets[textureAssetIndex] ?? null;
    }, [ textureAssetIndex, assets ]);

    useEffect(() =>
    {
        if(asset == null)
        {
            return;
        }

        setAssetSize(asset.size);
        setAssetLayerCode(asset.layerCode);
        setAssetDirection(asset.direction);
        setAssetFrameNumber(asset.frameNumber);
        setAssetIsIcon(asset.isIcon);
    }, [ asset ]);

    const saveChanges = () =>
    {
        setAssets(prevValue =>
        {
            if(prevValue[textureAssetIndex] === undefined) return prevValue;

            const newValue = [ ...prevValue ];
            const newAsset = { ...newValue[textureAssetIndex] };

            newAsset.size = assetSize;
            newAsset.layerCode = assetLayerCode;
            newAsset.direction = assetDirection;
            newAsset.frameNumber = assetFrameNumber;

            newValue[textureAssetIndex] = newAsset;

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

                //updateAsset('texture', texture);
            })();
        }
    }

    useEffect(() =>
    {
        if(!asset || !asset.texture) return;

        (async () => setTextureUrl(await TextureUtils.generateImageUrl(new Sprite(asset.texture))))();
    }, [ asset ]);

    if(textureAssetIndex === -1) return null;

    return (
        <Flex
            className="items-center justify-center gap-1">
            { textureUrl && textureUrl.length &&
                <Image className="object-none select-none min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px]" src={ textureUrl } /> }
            <Flex
                column
                className="w-full gap-1">
                <Flex
                    className="gap-1">
                    <Badge>{ localizeText(`asset.size.${ asset.isIcon ? 'icon' : asset.size }`) }</Badge>
                    <Badge>{ asset.isShadow ? localizeText('asset.shadow') : `${ localizeText('asset.layer') } ${ LetterToNumber(asset.layerCode) }` }</Badge>
                    { !asset.isIcon && <Badge>{ localizeText('asset.direction') } { localizeText(`asset.direction.${ asset.direction }`) }</Badge> }
                    { !asset.isIcon && <Badge>{ localizeText('asset.frame') } { asset.frameNumber }</Badge> }
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
