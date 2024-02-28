import { FC } from 'react';
import { AssetLogic, RoomObjectLogicType } from '../../../api';
import { useLanguage, useNitroBundle } from '../../../hooks';
import { Card, CardBody, CardHeader, CardHeaderTitle, Flex, Input, Label } from '../../../layout';

export const LogicEditorComponent: FC<{}> = props =>
{
    const { localizeText } = useLanguage();
    const { assetData = null, setAssetData = null } = useNitroBundle();
    const { logic = null } = assetData;

    const updateAssetData = (key: string, value: any) =>
    {
        setAssetData(prevValue =>
        {
            const newValue = prevValue.clone();

            if(!newValue.logic) newValue.logic = AssetLogic.from(newValue.logic);

            newValue.logic[key] = value;

            return newValue;
        });
    }

    if(!assetData) return null;

    return (
        <Card>
            <CardHeader>
                <CardHeaderTitle>Logic Editor</CardHeaderTitle>
            </CardHeader>
            <CardBody
                className="overflow-auto">
                <Flex
                    column>
                    { assetData.logicType === RoomObjectLogicType.FURNITURE_CREDIT &&
                        <Flex
                            className="gap-1">
                            <Label>
                                { localizeText('asset.credit') }
                            </Label>
                            <Input
                                type="number"
                                value={ logic.credits }
                                onChange={ event => updateAssetData('credits', event.target.valueAsNumber) } />
                        </Flex> }
                </Flex>
            </CardBody>
        </Card>
    );
}