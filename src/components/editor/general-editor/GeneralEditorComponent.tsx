import { FC } from 'react';
import { AssetOptions } from '../../../api';
import { useLanguage, useNitroBundle } from '../../../hooks';
import { Card, CardBody, CardHeader, CardHeaderTitle, Flex, Input, Label } from '../../../layout';

export const GeneralEditorComponent: FC<{}> = props =>
{
    const { localizeText } = useLanguage();
    const { assetData = null, setAssetData = null, refreshAssetData = null } = useNitroBundle();

    const updateAssetData = (key: string, value: any) =>
    {
        setAssetData(prevValue =>
        {
            const newValue = prevValue.clone();

            newValue[key] = value;

            return newValue;
        });
    }

    const setLayerCount = (count: number, size: number) =>
    {
        setAssetData(prevValue =>
        {
            prevValue.setLayerCount(count, size);

            return prevValue.clone();
        });
    }

    if(!assetData) return null;

    return (
        <Card>
            <CardHeader>
                <CardHeaderTitle>General Editor</CardHeaderTitle>
            </CardHeader>
            <CardBody
                className="overflow-auto">
                <Flex
                    column>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.name') }
                        </Label>
                        <Input
                            type="text"
                            value={ assetData.name }
                            onChange={ event => updateAssetData('name', event.target.value) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.visualizationType') }
                        </Label>
                        <Input
                            type="text"
                            value={ assetData.visualizationType }
                            onChange={ event => updateAssetData('visualizationType', event.target.value) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.logicType') }
                        </Label>
                        <Input
                            type="text"
                            value={ assetData.logicType }
                            onChange={ event => updateAssetData('logicType', event.target.value) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.layerCount') }
                        </Label>
                        <Input
                            type="text"
                            defaultValue={ assetData.getTotalLayers(AssetOptions.DEFAULT_SIZE) }
                            onChange={ event => setLayerCount(parseInt(event.target.value), AssetOptions.DEFAULT_SIZE) } />
                    </Flex>
                    <Flex
                        className="gap-1">
                        <Label>
                            { localizeText('asset.layerIconCount') }
                        </Label>
                        <Input
                            type="text"
                            defaultValue={ assetData.getTotalLayers(AssetOptions.ICON_SIZE) }
                            onChange={ event => setLayerCount(parseInt(event.target.value), AssetOptions.ICON_SIZE) } />
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    );
}
