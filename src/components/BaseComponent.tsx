import { FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useNitroBundle } from '../hooks';
import { Flex } from '../layout';
import { TopBarComponent } from './top-bar';
import { useNitroBuilderRoutes } from './useNitroBuilderRoutes';

export const BaseComponent: FC<{}> = props =>
{
    const { setActivePath = null } = useNitroBuilderRoutes();
    const { pathname = null } = useLocation();
    const { importBundle = null } = useNitroBundle();
    const navigate = useNavigate();

    useEffect(() =>
    {
        setActivePath(pathname);
    }, [ pathname, setActivePath ]);

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

                navigate(`/editor/${ file.name }`);
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
    }, []);

    return (
        <>
            <Flex
                column
                className="w-full fixed h-[100vh] nitro-builder-bg base">
                <TopBarComponent />
                <Flex
                    className="z-10 w-full h-full overflow-hidden">
                    <Outlet />
                </Flex>
            </Flex>
        </>
    );
}
