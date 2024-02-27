import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { CenterRoom, GetRoomEngine, PrepareRoomEngine, RoomPreviewer } from '../nitro';
import { SetActiveRoomId } from '../utils';

const useRoomPreviewerHook = () =>
{
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);

    const centerRoom = useCallback(() =>
    {
        CenterRoom(roomPreviewer.roomId, RoomPreviewer.PREVIEW_CANVAS_ID);
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        SetActiveRoomId(roomPreviewer.roomId);
    }, [ roomPreviewer ] );

    useEffect(() =>
    {
        const start = async () =>
        {
            await PrepareRoomEngine();

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

    return { roomPreviewer, centerRoom };
}

export const useRoomPreviewer = () => useBetween(useRoomPreviewerHook);
