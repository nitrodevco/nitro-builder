import { FC } from 'react';
import { useNitroBundle } from '../../../hooks';
import { Flex } from '../../../layout';

export const SideBarComponent: FC<{}> = () =>
{
    const { assetData } = useNitroBundle();

    return (
        <Flex
            className="w-full h-full gap-1">
            <Flex
                className="w-[50] h-full bg-[#8b8b8b]">
                list<br/>of<br />icons
            </Flex>
            <Flex
                className="w-full h-full">
            </Flex>
        </Flex>
    );
}
