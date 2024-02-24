import React, { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Flex } from './Flex';

const ItemTypes = {
    PANEL: 'panel',
};

interface SidepanelProps {
    id?: string;
    title?: string;
    content?: React.ReactNode;
    index?: number;
    movePanel?: (dragIndex: number, hoverIndex: number) => void;
}

export const Sidepanel: FC<SidepanelProps> = ({ id, title, content, index, movePanel }) => 
{
    const ref = useRef<HTMLDivElement>(null);
    const [ { isDragging }, drag ] = useDrag({
        type: ItemTypes.PANEL,
        item: () => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [ , drop ] = useDrop({
        accept: ItemTypes.PANEL,
        hover(item: { id: string; index: number }, monitor) 
        {
            if (!ref.current) 
            {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) 
            {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) 
            {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) 
            {
                return;
            }
            movePanel(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div ref={ ref } style={ { opacity: isDragging ? 0 : 1 } }>
            <Flex column className="flex bg-[#535353] w-full rounded-tr-md rounded-tl-md border border-[#636363] transition-all">
                <div className="cursor-move w-full bg-[#424242] text-white font-bold text-[10px] rounded-tr-md rounded-tl-md h-[15px] flex justify-center items-center">
                    { title }
                </div>
                <Flex column className="text-[12px] flex-1 h-full p-3 gap-1">
                    { content }
                </Flex>
            </Flex>
        </div>
    );
};
