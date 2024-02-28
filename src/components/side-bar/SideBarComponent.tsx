import { FC } from 'react';
import { useNitroBundle } from '../../hooks';
import { Button, Flex } from '../../layout';
import { AssetEditorComponent, TextureEditorComponent } from '../editor';
import { GeneralEditorComponent } from '../editor/general-editor';
import { LogicEditorComponent } from '../editor/logic-editor';

export const SideBarComponent: FC<{}> = () =>
{
    const { assetData, setAssetData, exportBundle } = useNitroBundle();

    if(!assetData) return null;

    const type = assetData?.type;
    const visualizations = assetData?.visualizations?.map(visualization => visualization.size) ?? [];

    return (
        <Flex
            column
            className="w-full h-full py-2">
            <Flex
                column
                className="gap-2 overflow-auto">
                <Button onClick={ () => exportBundle() }>Export Bundle</Button>
                <GeneralEditorComponent />
                <LogicEditorComponent />
                <TextureEditorComponent />
                <AssetEditorComponent />
            </Flex>
        </Flex>
    );
}
