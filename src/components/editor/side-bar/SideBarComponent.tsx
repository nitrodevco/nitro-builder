import React, { FC, useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNitroBundle } from '../../../hooks';
import { Button, Flex } from '../../../layout';
import { Sidepanel } from '../../../layout/Sidepanel';

interface PanelData {
    id: string;
    title: string;
    content: React.ReactNode;
}

export const SideBarComponent: FC<{}> = () => 
{
    const { assetData, exportBundle } = useNitroBundle();

    const initialPanels: PanelData[] = [
        {
            id: '1',
            title: 'Furniture info',
            content: (
                <>
                    <span>Name: { assetData?.name }</span>
                    <span>Type: { assetData?.type }</span>
                    <span>Visualization Type: { assetData?.visualizationType }</span>
                    <span>Logic Type: { assetData?.logicType }</span>
                    <span>Visualizations: { assetData?.visualizations?.map(v => v.size).join(', ') }</span>
                </>
            ),
        },
        { id: '2', title: 'Test', content: <span>Sidebar2</span> },
    ];

    const [ panels, setPanels ] = useState<PanelData[]>(initialPanels);

    const movePanel = useCallback((dragIndex: number, hoverIndex: number) => 
    {
        const dragPanel = panels[dragIndex];
        const updatedPanels = [ ...panels ];
        updatedPanels.splice(dragIndex, 1);
        updatedPanels.splice(hoverIndex, 0, dragPanel);
        setPanels(updatedPanels);
    }, [ panels ]);

    return (
        <DndProvider backend={ HTML5Backend }>
            <Flex column className="w-full h-full gap-1">
                { panels.map((panel, index) => (
                    <Sidepanel key={ panel.id } id={ panel.id } title={ panel.title } content={ panel.content } index={ index } movePanel={ movePanel }></Sidepanel>
                )) }
            </Flex>
            <Button onClick={ exportBundle }>Export Bundle</Button>
        </DndProvider>
    );
};
