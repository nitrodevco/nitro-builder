import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { GetPixi } from '../api/pixi/GetPixi';
import { NitroBuilderRouter } from './NitroBuilderRouter';

export const NitroBuilderComponent: FC<PropsWithChildren<{}>> = props =>
{
    const [ isReady, setIsReady ] = useState<boolean>(false);

    useEffect(() =>
    {
        (async () =>
        {
            try
            {
                await GetPixi().init({
                    autoStart: false,
                    autoDensity: false,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    resizeTo: window,
                    sharedTicker: true
                });

                console.log(GetPixi());

                setIsReady(true);
            }

            catch(err)
            {

            }
        })();
    }, []);

    if(!isReady) return null;

    return <NitroBuilderRouter />;
}
