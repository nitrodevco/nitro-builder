import { FC } from 'react';
import { useNitroBundle } from '../../hooks';
import { Button, Flex } from '../../layout';

export const SideBarComponent: FC<{}> = () =>
{
    const { assetData, setAssetData, exportBundle } = useNitroBundle();

    if(!assetData) return null;

    const type = assetData?.type;
    const visualizations = assetData?.visualizations?.map(visualization => visualization.size) ?? [];

    return (
        <Flex
            column
            className="w-full h-full gap-1 overflow-hidden">
            <Flex
                column>
                <span>name: { assetData.name }</span>
                <span>visualization type: { assetData.visualizationType }</span>
                <span>logic type: { assetData.logicType }</span>
                <span>visualizations: { visualizations.toString() }</span>
                <Button onClick={ () => exportBundle() }>Export Bundle</Button>
            </Flex>
        </Flex>
    );
}
