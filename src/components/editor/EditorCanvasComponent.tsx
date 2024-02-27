import { FC, useEffect, useRef } from 'react';
import { GetPixi, RoomObjectCategory, Vector3d } from '../../api';
import { useNitroBundle, useRoomPreviewer } from '../../hooks';
import { GetRoomEngine, RoomPreviewer } from '../../nitro';
import { DispatchMouseEvent } from '../../utils';
import { EditorCanvasToolsComponent } from './EditorCanvasToolsComponent';

export const EditorCanvasComponent: FC<{}> = props =>
{
    const { assetData = null, assets = null } = useNitroBundle();
    const { roomPreviewer, centerRoom = null } = useRoomPreviewer();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        const element = elementRef.current;
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
        
        const element = elementRef.current;
        const width = Math.floor(element.clientWidth);
        const height = Math.floor(element.clientHeight);
        const pixi = GetPixi();
        const container = roomPreviewer.getRoomCanvas(width, height);

        pixi.stage.addChild(container);

        centerRoom();
    }, [ roomPreviewer, centerRoom ]);

    useEffect(() =>
    {
        const element = elementRef.current;

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
        if(!assetData || !assets || !roomPreviewer) return;

        roomPreviewer.addFurnitureIntoRoom(assetData.name, new Vector3d(90))

        const camera = GetRoomEngine().getRoomCamera(roomPreviewer.roomId);

        camera.targetId = RoomPreviewer.PREVIEW_OBJECT_ID;
        camera.targetCategory = RoomObjectCategory.FLOOR;

        camera.activateFollowing(window.NitroBuilderConfig['camera.follow.duration']);

        return () =>
        {
            roomPreviewer.reset(true);
        }
    }, [ assetData, assets, roomPreviewer ]);

    return (
        <div className="relative w-full h-full" ref={ elementRef }>
            <EditorCanvasToolsComponent />
        </div>  
    );
}
