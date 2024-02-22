import { FC, useEffect, useRef } from 'react';
import { GetAssetManager, GetPixi, RoomVariableEnum, Vector3d } from '../../../api';
import { useNitroBundle, useRoomPreviewer } from '../../../hooks';
import { GetRoomEngine, RoomGeometry, RoomPreviewer } from '../../../nitro';
import { DispatchMouseEvent } from '../../../utils';
import { SetActiveRoomId } from '../../../utils/SetActiveRoomId';

export const PreviewComponent: FC<{}> = props =>
{
    const { assetData = null, spritesheet = null } = useNitroBundle();
    const { roomPreviewer } = useRoomPreviewer();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        SetActiveRoomId(roomPreviewer.roomId);

        const pixi = GetPixi();
        const canvas = pixi.canvas;
        const roomEngine = GetRoomEngine();
        const width = Math.floor(elementRef.current.clientWidth);
        const height = Math.floor(elementRef.current.clientHeight);

        pixi.renderer.resize(width, height);

        const container = roomPreviewer.getRoomCanvas(width, height);

        pixi.stage.addChild(container);

        const geometry = roomEngine.getRoomInstanceGeometry(roomPreviewer.roomId, RoomPreviewer.PREVIEW_CANVAS_ID) as RoomGeometry;

        if(geometry)
        {
            const minX = (roomEngine.getRoomInstanceVariable<number>(roomPreviewer.roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            const maxX = (roomEngine.getRoomInstanceVariable<number>(roomPreviewer.roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            const minY = (roomEngine.getRoomInstanceVariable<number>(roomPreviewer.roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            const maxY = (roomEngine.getRoomInstanceVariable<number>(roomPreviewer.roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

            let x = ((minX + maxX) / 2);
            let y = ((minY + maxY) / 2);

            const offset = 20;

            x = (x + (offset - 1));
            y = (y + (offset - 1));

            const z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

            geometry.location = new Vector3d(x, y, z);
        }

        const element = elementRef.current;

        if(!element) return;

        canvas.onclick = event => DispatchMouseEvent(event);
        canvas.onmousemove = event => DispatchMouseEvent(event);
        canvas.onmousedown = event => DispatchMouseEvent(event);
        canvas.onmouseup = event => DispatchMouseEvent(event);

        element.appendChild(canvas);

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!roomPreviewer || !elementRef.current) return;

            const width = Math.floor(elementRef.current.clientWidth);
            const height = Math.floor(elementRef.current.clientHeight);

            roomPreviewer.modifyRoomCanvas(width, height);

            pixi.renderer.resize(width, height);
            pixi.render();
        });
        
        resizeObserver.observe(elementRef.current);

        return () =>
        {
            resizeObserver.disconnect();

            pixi.stage.removeChild(container);

            element.removeChild(pixi.canvas);
            
        }
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!assetData || !spritesheet || !roomPreviewer) return;

        GetAssetManager().createCollection(assetData, spritesheet);

        roomPreviewer.addFurnitureIntoRoom(assetData.name, new Vector3d(90));

        return () =>
        {
            roomPreviewer.reset(true);
        }
    }, [ assetData, spritesheet, roomPreviewer ]);

    return (
        <div className="w-full h-full" ref={ elementRef } />
    );
}
