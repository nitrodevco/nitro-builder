import { FC } from 'react';
import { useNitroBundle } from '../../../hooks';
import { Button, Flex } from '../../../layout';

export const SideBarComponent: FC<{}> = () =>
{
    const { assetData, setAssetData, exportBundle } = useNitroBundle();

    const type = assetData?.type;
    const visualizations = assetData?.visualizations?.map(visualization => visualization.size) ?? [];

    return (
        <Flex
            className="w-full h-full gap-1">
            <Flex
                className="w-[50] h-full bg-[#8b8b8b]">
                list<br/>of<br />icons
            </Flex>
            <Flex
                column
                className="w-full h-full">
                <span>name: { assetData.name }</span>
                <span>visualization type: { assetData.visualizationType }</span>
                <span>logic type: { assetData.logicType }</span>
                <span>visualizations: { visualizations.toString() }</span>
                <Button onClick={ () => exportBundle() }>Export Bundle</Button>
            </Flex>
        </Flex>
    );
}
