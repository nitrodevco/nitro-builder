import { FC } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import { Asset } from '../../../api';
import { useLanguage, useNitroBundle } from '../../../hooks';
import { Button, Flex, Input, Label } from '../../../layout';

export const AssetEditorItemComponent: FC<{ asset: Asset }> = props =>
{
    const { asset = null } = props;
    const { localizeText } = useLanguage();
    const { refreshAssetData = null } = useNitroBundle();

    const updateAsset = (key: keyof Asset, value: any) =>
    {
        if(asset[key] === undefined) return;

        //@ts-ignore
        asset[key] = value;

        refreshAssetData();
    }

    if(!asset) return null;

    return (
        <Flex
            className="justify-center gap-1">
            <Flex
                className="items-center justify-center w-10 h-10 overflow-hidden">
            </Flex>
            <Flex
                className="w-full gap-1">
                <Flex
                    className="gap-2 text-xs">
                    <Flex
                        column
                        className="gap-1 justify-center items-center">
                        <Label>
                            { localizeText('asset.x') }
                        </Label>
                        <Flex
                            className="gap-1">
                            <Button
                                size="xs"
                                onClick={ event => updateAsset('x', (asset.x + 1)) }>
                                <MdAdd />
                            </Button>
                            { asset.x }
                            <Button
                                size="xs"
                                onClick={ event => updateAsset('x', (asset.x - 1)) }>
                                <MdRemove />
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex
                        column
                        className="gap-1 justify-center items-center">
                        <Label>
                            { localizeText('asset.y') }
                        </Label>
                        <Flex
                            className="gap-1">
                            <Button
                                size="xs"
                                onClick={ event => updateAsset('y', (asset.y + 1)) }>
                                <MdAdd />
                            </Button>
                            { asset.y }
                            <Button
                                size="xs"
                                onClick={ event => updateAsset('y', (asset.y - 1)) }>
                                <MdRemove />
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex
                        column
                        className="gap-1 justify-center items-center">
                        <Label>
                            { localizeText('asset.flipH') }
                        </Label>
                        <Flex
                            className="gap-1">
                            <Input
                                type="checkbox"
                                inputSize="xs"
                                checked={ asset.flipH }
                                onChange={ event => updateAsset('flipH', event.target.checked) } />
                        </Flex>
                    </Flex>
                    <Flex
                        column
                        className="gap-1 justify-center items-center">
                        <Label>
                            { localizeText('asset.flipV') }
                        </Label>
                        <Flex
                            className="gap-1">
                            <Input
                                type="checkbox"
                                inputSize="xs"
                                checked={ asset.flipV }
                                onChange={ event => updateAsset('flipV', event.target.checked) } />
                        </Flex>
                    </Flex>
                    <Flex
                        column
                        className="gap-1 justify-center items-center">
                        <Label>
                            { localizeText('asset.usesPalette') }
                        </Label>
                        <Flex
                            className="gap-1">
                            <Input
                                type="checkbox"
                                inputSize="xs"
                                checked={ asset.usesPalette }
                                onChange={ event => updateAsset('usesPalette', event.target.checked) } />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
