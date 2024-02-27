import { FC, PropsWithChildren } from 'react';
import { useFileUploader, useNitroBundle } from '../hooks';
import { Flex } from '../layout';
import { EditorCanvasComponent } from './editor';
import { SideBarComponent } from './side-bar';
import { TopBarComponent } from './top-bar';

export const NitroBuilderComponent: FC<PropsWithChildren<{}>> = props =>
{
    const { assetData = null } = useNitroBundle();
    const {} = useFileUploader();

    return (
        <Flex
            column
            className="w-full fixed h-[100vh] bg-gray-300">
            <TopBarComponent />
            <Flex
                className="z-10 w-full h-full overflow-hidden">
                <Flex
                    justifyContent="center"
                    className="z-10 w-full h-full overflow-hidden bg-black">
                    <EditorCanvasComponent />
                </Flex>
                { assetData != null &&
                    <Flex
                        className="z-20 w-full h-full overflow-hidden text-white bg-side-bar"
                        style={ { maxWidth: 300 } }>
                        <Flex
                            column
                            className="w-full p-2">
                            <SideBarComponent />
                        </Flex>
                    </Flex> }
            </Flex>
        </Flex>
    );
}
