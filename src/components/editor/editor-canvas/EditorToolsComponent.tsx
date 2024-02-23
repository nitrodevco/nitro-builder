import { FC, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNitroBundle, useRoomPreviewer } from '../../../hooks';
import { Button } from '../../../layout';
import { GetRoomEngine } from '../../../nitro';

export const EditorToolsComponent: FC<{}> = props =>
{
    const { assetData = null, setAssetData = null, spritesheet = null } = useNitroBundle();
    const { roomPreviewer } = useRoomPreviewer();
    const elementRef = useRef<HTMLDivElement>();

    const zoomIn = () =>
    {
        const scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1);
        GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1, scale + 0.5);
    }

    const zoomOut = () =>
    {
        const scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1);
        GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1, scale - 0.5);
    }

    const randomEdit = () =>
    {
        setAssetData(prevValue =>
        {
            const newAssetData = { ...prevValue };
            
            Object.keys(newAssetData.assets).forEach(assetKey =>
            {
                const asset = newAssetData.assets[assetKey];

                if(!asset) return;

                asset.x += 11;
            });

            return newAssetData;
        });
    }

    return createPortal(
        <div className="absolute top-[100px] left-[100px] w-[200px] h-[200px] text-black bg-white">
            <Button
                onClick={ () => zoomIn() }>
                    zoom in
            </Button>
            <Button
                onClick={ () => zoomOut() }>
                    zoom out
            </Button>
            <Button
                onClick={ () => randomEdit() }>
                    move assets over
            </Button>
        </div>, document.getElementById('generic-windows'))
}
