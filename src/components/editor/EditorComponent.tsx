import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useNitroBundle } from '../../hooks';
import { Flex } from '../../layout';
import { PreviewComponent } from './preview';
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

        console.log(assetData);
    }, [ assetData, navigate ]);

    if(!assetData) return null;

    const type = assetData?.type;
    const visualizations = assetData?.visualizations?.map(visualization => visualization.size) ?? [];

    return (
        <>
            <Flex
                justifyContent="center"
                className="z-10 w-full h-full p-4 overflow-auto">
                <div
                    className="container w-full h-full">
                    <Flex
                        column>
                        <span>name: { assetData.name }</span>
                        <span>visualization type: { assetData.visualizationType }</span>
                        <span>logic type: { assetData.logicType }</span>
                        <span>visualizations: { visualizations.toString() }</span>
                        <PreviewComponent />
                    </Flex>
                </div>
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
