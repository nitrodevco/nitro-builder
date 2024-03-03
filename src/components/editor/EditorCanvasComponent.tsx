import { FC, useEffect, useRef, useState } from 'react';
import { MdAspectRatio, MdStar, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { GetPixi, IObjectData, IVector3D, RoomObjectCategory, RoomObjectVariable, Vector3d } from '../../api';
import { useNitroBundle } from '../../hooks';
import { Button, Flex } from '../../layout';
import { CenterRoom, CreatePlaneParser, FurnitureVisualization, GetRoomEngine, LegacyDataType, PrepareRoomEngine, RoomId, RoomObjectVisualizationFactory } from '../../nitro';
import { DispatchMouseEvent, SetActiveRoomId } from '../../utils';

const CANVAS_ID = 1;
const PREVIEW_OBJECT_ID = 1;
const PREVIEW_OBJECT_LOCATION_X = 2;
const PREVIEW_OBJECT_LOCATION_Y = 2;
let PREVIEW_COUNTER = 0;

export const EditorCanvas2Component: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState<boolean>(false);
    const [ isRoomReady, setIsRoomReady ] = useState<boolean>(false);
    const [ currentRoomId, setCurrentRoomId ] = useState<number>(RoomId.makeRoomPreviewerId(++PREVIEW_COUNTER));
    const [ currentObjectId, setCurrentObjectId ] = useState<number>(-1);
    const [ currentObjectCategory, setCurrentObjectCategory ] = useState<number>(RoomObjectCategory.MINIMUM);
    const { assetData = null, assets = null } = useNitroBundle();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(!assetData || !assets || !isRoomReady) return;

        const addFurnitureIntoRoom = (objectId: number, type: string, direction: IVector3D, objectData: IObjectData = null, extra: string = null) =>
        {
            if((currentObjectId > -1) && (currentObjectCategory > RoomObjectCategory.MINIMUM))
            {
                const roomObject = GetRoomEngine().getRoomObject(currentRoomId, currentObjectId, currentObjectCategory);

                if(roomObject && roomObject.type === type && (roomObject.visualization instanceof (GetRoomEngine().visualizationFactory as RoomObjectVisualizationFactory).getVisualizationType(assetData.visualizationType)))
                {
                    (roomObject.visualization as FurnitureVisualization)._data.initialize(assetData.toJSON());

                    roomObject.model.forceRefresh();
                    
                    return;
                }
                else
                {
                    console.log('remove it')
                    GetRoomEngine().removeRoomObjectFloor(currentRoomId, currentObjectId);
                }
            }

            if(!objectData) objectData = new LegacyDataType();

            if(!GetRoomEngine().addFurnitureFloorByTypeName(currentRoomId, objectId, type, new Vector3d(PREVIEW_OBJECT_LOCATION_X, PREVIEW_OBJECT_LOCATION_Y, 0), direction, 0, objectData, NaN, -1, 0, -1, '', true, false)) return;
            
            const roomObject = GetRoomEngine().getRoomObject(currentRoomId, objectId, RoomObjectCategory.FLOOR);

            if(roomObject && extra) roomObject.model.setValue(RoomObjectVariable.FURNITURE_EXTRAS, extra);

            setCurrentObjectId(PREVIEW_OBJECT_ID);
            setCurrentObjectCategory(RoomObjectCategory.FLOOR);
        }

        const objectId = PREVIEW_OBJECT_ID;

        addFurnitureIntoRoom(objectId, assetData.name, new Vector3d(90))

        const camera = GetRoomEngine().getRoomCamera(currentRoomId);

        camera.targetId = objectId;
        camera.targetCategory = RoomObjectCategory.FLOOR;

        camera.activateFollowing(window.NitroBuilderConfig['camera.follow.duration']);
    }, [ assetData, assets, isRoomReady, currentRoomId, currentObjectId, currentObjectCategory ]);

    useEffect(() =>
    {
        if(!isRoomReady) return;

        const element = elementRef.current;

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!element || !isRoomReady) return;

            GetRoomEngine().initializeRoomInstanceRenderingCanvas(currentRoomId, CANVAS_ID, Math.floor(element.clientWidth), Math.floor(element.clientHeight));
        });

        resizeObserver.observe(element);

        return () =>
        {
            resizeObserver.disconnect();
        }
    }, [ isRoomReady, currentRoomId ])

    useEffect(() =>
    {
        if(!isReady) return;

        const roomId = currentRoomId;
        const planeParser = CreatePlaneParser(7, 7);

        GetRoomEngine().createRoomInstance(roomId, planeParser.getMapData());

        planeParser.dispose();
        
        const element = elementRef.current;
        const width = Math.floor(element.clientWidth);
        const height = Math.floor(element.clientHeight);
        const pixi = GetPixi();
        const displayObject = GetRoomEngine().getRoomInstanceDisplay(currentRoomId, CANVAS_ID, width, height, 64);

        GetRoomEngine().setRoomInstanceRenderingCanvasMask(currentRoomId, CANVAS_ID, true);

        pixi.stage.addChild(displayObject);

        CenterRoom(currentRoomId, CANVAS_ID);
        SetActiveRoomId(currentRoomId);
        setIsRoomReady(true);

        return () =>
        {
            GetRoomEngine().destroyRoom(roomId);
            setIsReady(false);
        }
    }, [ currentRoomId, isReady ]);

    useEffect(() =>
    {
        const start = async () =>
        {
            const element = elementRef.current;
            const width = Math.floor(element.clientWidth);
            const height = Math.floor(element.clientHeight);

            await PrepareRoomEngine(width, height);

            const pixi = GetPixi();
            const canvas = pixi.canvas;

            canvas.onclick = event => DispatchMouseEvent(event);
            canvas.onmousemove = event => DispatchMouseEvent(event);
            canvas.onmousedown = event => DispatchMouseEvent(event);
            canvas.onmouseup = event => DispatchMouseEvent(event);

            pixi.resizeTo = element;

            element.appendChild(canvas);

            setIsReady(true);
        }

        start();

        return () =>
        {
            setIsReady(false);
        }
    }, []);

    const zoomIn = () =>
    {
        let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(currentRoomId, CANVAS_ID);

        switch(scale)
        {
            case 0.5:
                scale = 1;
                break;
            case 8:
                return;
            default:
                scale += 1;
        }

        GetRoomEngine().setRoomInstanceRenderingCanvasScale(currentRoomId, CANVAS_ID, scale);
    }

    const zoomOut = () =>
    {
        let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(currentRoomId, CANVAS_ID);

        switch(scale)
        {
            case 0.5:
                return;
            case 1:
                scale = 0.5;
                break;
            default:
                scale -= 1;
        }

        GetRoomEngine().setRoomInstanceRenderingCanvasScale(currentRoomId, CANVAS_ID, scale);
    }

    const changeRoomGeometrySize = () =>
    {
        const geometry = GetRoomEngine().getRoomInstanceGeometry(currentRoomId, CANVAS_ID);

        geometry.scale = geometry.scale === 64 ? 1 : 64;
    }

    const changeObjectState = () => GetRoomEngine().changeObjectState(currentRoomId, currentObjectId, currentObjectCategory);

    return (
        <div className="relative w-full h-full" ref={ elementRef }>
            { isRoomReady &&
                <Flex className="absolute gap-1 p-1 bg-gray-800 rounded-md bg-opacity-80 top-2 right-2">
                    <Flex className="gap-1">
                        <Button
                            color="dark"
                            size="sm"
                            onClick={ () => zoomOut() }>
                            <MdZoomOut />
                        </Button>
                        <Button
                            color="dark"
                            size="sm"
                            onClick={ () => zoomIn() }>
                            <MdZoomIn />
                        </Button>
                        <Button
                            color="dark"
                            size="sm"
                            onClick={ () => changeRoomGeometrySize() }>
                            <MdAspectRatio />
                        </Button>
                        <Button
                            color="dark"
                            size="sm"
                            onClick={ () => changeObjectState() }>
                            <MdStar />
                        </Button>
                    </Flex>
                </Flex> }
        </div>  
    );
}
