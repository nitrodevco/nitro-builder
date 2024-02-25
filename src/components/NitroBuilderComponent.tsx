import { FC, PropsWithChildren, useEffect } from 'react';
import { useNitroBundle } from '../hooks';
import { Flex } from '../layout';
import { EditorCanvasComponent } from './editor';
import { SideBarComponent } from './side-bar';
import { TopBarComponent } from './top-bar';

export const NitroBuilderComponent: FC<PropsWithChildren<{}>> = props =>
{
    const { assetData = null, importBundle = null } = useNitroBundle();

    useEffect(() =>
    {
        const onDrop = async (event: DragEvent) =>
        {
            event.preventDefault();

            try
            {
                const file = event?.dataTransfer?.files?.[0];

                if(!file) return;

                await importBundle(file);
            }

            catch(err)
            {
                console.error(err);
            }
        }

        document.body.addEventListener('dragenter', event =>
        {
            event.preventDefault();
        });

        document.body.addEventListener('dragover', event =>
        {
            event.preventDefault();
        });

        document.body.addEventListener('drop', onDrop);

        return () =>
        {
            document.body.removeEventListener('drop', onDrop);
        }
    }, [ importBundle ]);

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
