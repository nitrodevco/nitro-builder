import { FC, useEffect, useRef, useState } from 'react';
import { GetPixi, IRoomRenderingCanvas, Vector3d } from '../../../api';
import { useNitroBundle } from '../../../hooks';
import { GetRoomEngine, RoomPreviewer } from '../../../nitro';

export const PreviewComponent: FC<{}> = props =>
{
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ renderingCanvas, setRenderingCanvas ] = useState<IRoomRenderingCanvas>(null);
    const { assetData = null, texture = null, spritesheet = null } = useNitroBundle();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        const element = elementRef.current;

        if(!element) return;

        element.appendChild(GetPixi().canvas);
    }, []);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        const container = roomPreviewer.getRoomCanvas(Math.floor(elementRef.current.clientWidth), Math.floor(elementRef.current.clientHeight));
        const renderingCanvas = roomPreviewer.getRenderingCanvas();

        setRenderingCanvas(renderingCanvas);
    }, [ roomPreviewer ]);

    useEffect(() =>
    {
        if(!renderingCanvas) return;

        const canvas = renderingCanvas.master;

        GetPixi().stage.addChild(canvas);

        return () =>
        {
            GetPixi().stage.removeChild(canvas);
        }
    }, [ renderingCanvas ]);

    useEffect(() =>
    {
        if(!roomPreviewer || !assetData) return;

        const previewer = roomPreviewer;

        console.log(assetData);

        previewer.addFurnitureIntoRoom(assetData.name, new Vector3d(90));

        return () =>
        {
            previewer.reset(true);
        }
    }, [ roomPreviewer, assetData ]);

    return (
        <div className="w-full h-full" ref={ elementRef } />
    );
}
