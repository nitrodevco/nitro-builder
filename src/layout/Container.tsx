import { FC, ReactNode } from 'react';
import { useNitroBundle } from '../hooks';
import { Flex } from './Flex';

interface ContainerProps {
    title?: string;
    children: ReactNode;
}

export const Container: FC<ContainerProps> = ({ title, children }) => 
{
    const { exportBundle } = useNitroBundle();

    return (
        <Flex column className="flex bg-[#535353] w-full rounded-tr-md rounded-tl-md border border-[#636363] transition-all">
            <div className="bg-[#424242] text-white font-bold text-[10px] rounded-tr-md rounded-tl-md h-[15px] flex justify-center items-center">
                { title }
            </div>
            <Flex column className="text-[12px] flex-1 h-full p-3 gap-1">
                { children }
            </Flex>
        </Flex>
    );
};
