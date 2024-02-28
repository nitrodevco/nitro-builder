import { FC } from 'react';
import { Asset } from '../../../api';
import { useLanguage, useNitroBundle } from '../../../hooks';
import { Flex, Input, Label } from '../../../layout';

export const AssetEditorItemComponent: FC<{ asset: Asset }> = props =>
{
    const { asset = null } = props;
    const { localizeText } = useLanguage();
    const { refreshAssetData = null } = useNitroBundle();

    const updateAsset = (key: string, value: any) =>
    {
        if(asset[key] === undefined) return;

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
                        className="gap-1">
                        <Label>
                            { localizeText('asset.x') }
                        </Label>
                        <Input
                            type="number"
                            value={ asset.x }
                            onChange={ event => updateAsset('x', event.target.valueAsNumber) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.y') }
                        </Label>
                        <Input
                            type="number"
                            value={ asset.y }
                            onChange={ event => updateAsset('y', event.target.valueAsNumber) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.flipH') }
                        </Label>
                        <Input
                            type="checkbox"
                            checked={ asset.flipH }
                            onChange={ event => updateAsset('flipH', event.target.checked) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.flipV') }
                        </Label>
                        <Input
                            type="checkbox"
                            checked={ asset.flipV }
                            onChange={ event => updateAsset('flipV', event.target.checked) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.usesPalette') }
                        </Label>
                        <Input
                            type="checkbox"
                            checked={ asset.usesPalette }
                            onChange={ event => updateAsset('usesPalette', event.target.checked) } />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
