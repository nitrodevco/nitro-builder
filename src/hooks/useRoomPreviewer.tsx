import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { GetRoomEngine, RoomPreviewer } from '../nitro';

const useRoomPreviewerHook = () =>
{
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

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
