import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useNitroBundle } from '../../hooks';
import { Flex } from '../../layout';
import { SideBarComponent } from './side-bar';

export const EditorComponent: FC<{}> = props =>
{
    const { assetData = null } = useNitroBundle();
    const { localizeText } = useLanguage();
    const navigate = useNavigate();

    useEffect(() =>
    {
        if(!assetData)
        {
            navigate('/');

            return;
        }
    }, [ assetData, navigate ]);

    if(!assetData) return null;

    return (
        <>
            <Flex
                justifyContent="center"
                className="z-10 w-full h-full p-4 overflow-auto">
                <div
                    className="container w-full h-full">
                    <Flex>
                        { assetData.name }
                    </Flex>
                </div>
            </Flex>
            <Flex
                className="z-20 w-full h-full overflow-hidden text-white bg-side-bar"
                style={ { maxWidth: 300 } }>
                <Flex
                    column
                    className="w-full px-5 py-4 overflow-y-scroll">
                    <SideBarComponent />
                </Flex>
            </Flex>
        </>
    );
}
