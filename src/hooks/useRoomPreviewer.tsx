import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { GetAssetManager, GetPixi, GetTicker } from '../api';
import { GetRoomEngine, RoomPreviewer } from '../nitro';

const useRoomPreviewerHook = () =>
{
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);

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

            await GetAssetManager().downloadAsset('https://assets.nitrodev.co/bundled/generic/room.nitro');
            await GetAssetManager().downloadAsset('https://assets.nitrodev.co/bundled/generic/tile_cursor.nitro');
            await GetRoomEngine().init();

            GetTicker().maxFPS = window.NitroBuilderConfig['system.fps.max'];

            setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));
        }

        start();

        return () =>
        {
            setRoomPreviewer(prevValue =>
            {
                prevValue.dispose();

                return null;
            });
        }
    }, []);

    return { roomPreviewer };
}

export const useRoomPreviewer = () => useBetween(useRoomPreviewerHook);
