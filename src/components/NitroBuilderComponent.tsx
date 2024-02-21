import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { GetAssetManager, GetPixi, GetTicker } from '../api';
import { GetRoomEngine } from '../nitro';
import { NitroBuilderRouter } from './NitroBuilderRouter';

export const NitroBuilderComponent: FC<PropsWithChildren<{}>> = props =>
{
    const [ isReady, setIsReady ] = useState<boolean>(false);

    useEffect(() =>
    {
        const start = async () =>
        {
            await GetPixi().init({
                autoStart: false,
                autoDensity: false,
                width: 800,
                height: 600,
                sharedTicker: true,
                backgroundAlpha: 0
            });

            await GetAssetManager().downloadAsset('./room.nitro');
            await GetAssetManager().downloadAsset('./tile_cursor.nitro');

            console.log(GetAssetManager().collections);

            console.log('yep')

            const roomEngine = GetRoomEngine();

            await roomEngine.init();

            GetTicker().maxFPS = window.NitroBuilderConfig['system.fps.max'];

            setIsReady(true);
        }

        start();
    }, []);

    if(!isReady) return null;

    return <NitroBuilderRouter />;
}
