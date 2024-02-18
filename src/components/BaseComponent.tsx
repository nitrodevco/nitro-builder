import { FC, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Flex } from '../layout';
import { TopBarComponent } from './top-bar';
import { useNitroBuilderRoutes } from './useNitroBuilderRoutes';

export const BaseComponent: FC<{}> = props =>
{
    const { setActivePath = null } = useNitroBuilderRoutes();
    const { pathname = null } = useLocation();

    useEffect(() =>
    {
        setActivePath(pathname);
    }, [ pathname, setActivePath ]);

    return (
        <>
            <Flex
                column
                className="w-full fixed h-[100vh] bg-gray-300">
                <TopBarComponent />
                <Flex
                    className="z-10 w-full h-full overflow-hidden">
                    <Outlet />
                </Flex>
            </Flex>
        </>
    );
}
