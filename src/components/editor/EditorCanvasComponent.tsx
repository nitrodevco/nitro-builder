import { FC, useCallback, useEffect, useRef } from 'react';
import { GetAssetManager, GetPixi, RoomObjectCategory, RoomVariableEnum, Vector3d } from '../../api';
import { useNitroBundle, useRoomPreviewer } from '../../hooks';
import { GetRoomEngine, RoomGeometry, RoomPreviewer } from '../../nitro';
import { DispatchMouseEvent } from '../../utils';
import { EditorToolsComponent } from './EditorToolsComponent';

export const EditorCanvasComponent: FC<{}> = props =>
{
    const { assetData = null, spritesheet = null } = useNitroBundle();
    const { roomPreviewer } = useRoomPreviewer();
    const elementRef = useRef<HTMLDivElement>();

    const centerRoom = useCallback(() =>
    {
        const roomEngine = GetRoomEngine();
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
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        const element = elementRef.current.parentElement;
        const width = Math.floor(element.clientWidth);
        const height = Math.floor(element.clientHeight);
        const pixi = GetPixi();
        const canvas = pixi.canvas;

        canvas.onclick = event => DispatchMouseEvent(event);
        canvas.onmousemove = event => DispatchMouseEvent(event);
        canvas.onmousedown = event => DispatchMouseEvent(event);
        canvas.onmouseup = event => DispatchMouseEvent(event);
        //canvas.style['imageRendering'] = 'pixelated';

        pixi.renderer.resize(width, height);
        pixi.render();

        element.appendChild(canvas);
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;
        
        const element = elementRef.current.parentElement;
        const width = Math.floor(element.clientWidth);
        const height = Math.floor(element.clientHeight);
        const pixi = GetPixi();
        const container = roomPreviewer.getRoomCanvas(width, height);

        pixi.stage.addChild(container);

        centerRoom();
    }, [ roomPreviewer, centerRoom ]);

    useEffect(() =>
    {
        const element = elementRef.current.parentElement;

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!roomPreviewer || !element) return;

            const width = Math.floor(element.clientWidth);
            const height = Math.floor(element.clientHeight);

            roomPreviewer.modifyRoomCanvas(width, height);

            GetPixi().renderer.resize(width, height);
            GetPixi().render();
        });
        
        resizeObserver.observe(element);

        return () =>
        {
            resizeObserver.disconnect();
        }
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!assetData || !spritesheet || !roomPreviewer) return;

        GetAssetManager().createCollection(assetData, spritesheet);

        roomPreviewer.addFurnitureIntoRoom(assetData.name, new Vector3d(90))

        const camera = GetRoomEngine().getRoomCamera(roomPreviewer.roomId);

        camera.targetId = RoomPreviewer.PREVIEW_OBJECT_ID;
        camera.targetCategory = RoomObjectCategory.FLOOR;

        camera.activateFollowing(window.NitroBuilderConfig['camera.follow.duration']);

        return () =>
        {
            roomPreviewer.reset(true);
        }
    }, [ assetData, spritesheet, roomPreviewer ]);

    return (
        <div className="w-full h-full" ref={ elementRef }>
            <EditorToolsComponent />
        </div>
    );
}
