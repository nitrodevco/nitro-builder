import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNitroBundle } from '../../hooks';
import { Flex } from '../../layout';
import { EditorCanvasComponent } from './editor-canvas';
import { SideBarComponent } from './side-bar';

export const EditorComponent: FC<{}> = props =>
{
    const { assetData = null } = useNitroBundle();
    const navigate = useNavigate();

    useEffect(() =>
    {
        if(!assetData)
        {
            navigate('/');

            return;
        }

        console.log(assetData);
    }, [ assetData, navigate ]);

    if(!assetData) return null;

    return (
        <>
            <Flex
                justifyContent="center"
                className="z-10 w-full h-full overflow-hidden bg-black">
                <EditorCanvasComponent />
            </Flex>
            <Flex
                className="z-20 w-full h-full overflow-hidden text-white bg-side-bar"
                style={ { maxWidth: 300 } }>
                <Flex
                    column
                    className="w-full p-2">
                    <SideBarComponent />
                </Flex>
            </Flex>
        </>
    );
}
