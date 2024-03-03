import { Container, Point, Rectangle } from 'pixi.js';
import { GetTickerTime, IObjectData, IRoomObjectController, IRoomRenderingCanvas, IVector3D, RoomObjectCategory, RoomObjectUserType, RoomObjectVariable, Vector3d } from '../../api';
import { NitroEventDispatcher, RoomEngineEvent, RoomEngineObjectEvent } from '../events';
import { RoomEngine } from './RoomEngine';
import { ObjectRoomMapUpdateMessage } from './messages';
import { LegacyDataType, RoomPlaneParser } from './object';
import { FloorHeightMapMessageParser, LegacyWallGeometry, RoomId } from './utils';

export class RoomPreviewer
{
    public static SCALE_NORMAL: number = 64;
    public static SCALE_SMALL: number = 32;
    public static PREVIEW_COUNTER: number = 0;
    public static PREVIEW_CANVAS_ID: number = 1;
    public static PREVIEW_OBJECT_ID: number = 1;
    public static PREVIEW_OBJECT_LOCATION_X: number = 2;
    public static PREVIEW_OBJECT_LOCATION_Y: number = 2;

    private static AUTOMATIC_STATE_CHANGE_INTERVAL: number = 2500;

    private _roomEngine: RoomEngine;
    private _planeParser: RoomPlaneParser;
    private _previewRoomId: number = 1;
    private _currentPreviewObjectType: string = null;
    private _currentPreviewObjectCategory: number = 0;
    private _currentPreviewObjectData: string = '';
    private _currentPreviewRectangle: Rectangle = null;
    private _currentPreviewCanvasWidth: number = 0;
    private _currentPreviewCanvasHeight: number = 0;
    private _currentPreviewScale: number = 64;
    private _automaticStateChange: boolean;
    private _previousAutomaticStateChangeTime: number;
    private _disableUpdate: boolean = false;

    constructor(roomEngine: RoomEngine, roomId: number = 1)
    {
        this._roomEngine = roomEngine;
        this._planeParser = new RoomPlaneParser();
        this._previewRoomId = RoomId.makeRoomPreviewerId(roomId);

        this.onRoomObjectAdded = this.onRoomObjectAdded.bind(this);
        this.onRoomInitializedonRoomInitialized = this.onRoomInitializedonRoomInitialized.bind(this);

        NitroEventDispatcher.addEventListener(RoomEngineObjectEvent.ADDED, this.onRoomObjectAdded);
        NitroEventDispatcher.addEventListener(RoomEngineObjectEvent.CONTENT_UPDATED, this.onRoomObjectAdded);
        NitroEventDispatcher.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomInitializedonRoomInitialized);

        this.createRoomForPreview();
    }

    public dispose(): void
    {
        this.reset(true);

        NitroEventDispatcher.removeEventListener(RoomEngineObjectEvent.ADDED, this.onRoomObjectAdded);
        NitroEventDispatcher.removeEventListener(RoomEngineObjectEvent.CONTENT_UPDATED, this.onRoomObjectAdded);
        NitroEventDispatcher.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomInitializedonRoomInitialized);

        if(this._planeParser)
        {
            this._planeParser.dispose();

            this._planeParser = null;
        }
    }

    private createRoomForPreview(): void
    {
        const size = 7;

        const planeParser = new RoomPlaneParser();

        planeParser.initializeTileMap((size + 2), (size + 2));

        let y = 1;

        while(y < (1 + size))
        {
            let x = 1;

            while(x < (1 + size))
            {
                planeParser.setTileHeight(x, y, 0);

                x++;
            }

            y++;
        }

        planeParser.initializeFromTileData();

        this._roomEngine.createRoomInstance(this._previewRoomId, planeParser.getMapData());

        planeParser.dispose();
    }

    public reset(k: boolean): void
    {
        this._roomEngine.removeRoomObjectFloor(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID);
        this._roomEngine.removeRoomObjectWall(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID);
        this._roomEngine.removeRoomObjectUser(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID);

        if(!k) this.updatePreviewRoomView();

        this._currentPreviewObjectCategory = RoomObjectCategory.MINIMUM;
    }

    public updatePreviewModel(model: string, wallHeight: number, scale: boolean = true): void
    {
        const parser = new FloorHeightMapMessageParser();

        parser.flush();
        parser.parseModel(model, wallHeight, scale);

        //@ts-ignore
        const wallGeometry = (this._roomEngine as IRoomCreator).getLegacyWallGeometry(this._previewRoomId);

        if(!wallGeometry) return;

        this._planeParser.reset();

        const width = parser.width;
        const height = parser.height;

        this._planeParser.initializeTileMap(width, height);

        let doorX = -1;
        let doorY = -1;
        let doorZ = 0;
        let doorDirection = 0;

        let y = 0;

        while(y < height)
        {
            let x = 0;

            while(x < width)
            {
                const tileHeight = parser.getHeight(x, y);

                if(((((y > 0) && (y < (height - 1))) || ((x > 0) && (x < (width - 1)))) && (!(tileHeight == RoomPlaneParser.TILE_BLOCKED))))
                {
                    if(((parser.getHeight(x, (y - 1)) == RoomPlaneParser.TILE_BLOCKED) && (parser.getHeight((x - 1), y) == RoomPlaneParser.TILE_BLOCKED)) && (parser.getHeight(x, (y + 1)) == RoomPlaneParser.TILE_BLOCKED))
                    {
                        doorX = (x + 0.5);
                        doorY = y;
                        doorZ = tileHeight;
                        doorDirection = 90;
                    }

                    if(((parser.getHeight(x, (y - 1)) == RoomPlaneParser.TILE_BLOCKED) && (parser.getHeight((x - 1), y) == RoomPlaneParser.TILE_BLOCKED)) && (parser.getHeight((x + 1), y) == RoomPlaneParser.TILE_BLOCKED))
                    {
                        doorX = x;
                        doorY = (y + 0.5);
                        doorZ = tileHeight;
                        doorDirection = 180;
                    }
                }

                this._planeParser.setTileHeight(x, y, tileHeight);

                x++;
            }

            y++;
        }

        this._planeParser.setTileHeight(Math.floor(doorX), Math.floor(doorY), doorZ);
        this._planeParser.initializeFromTileData(parser.wallHeight);
        this._planeParser.setTileHeight(Math.floor(doorX), Math.floor(doorY), (doorZ + this._planeParser.wallHeight));

        wallGeometry.scale = LegacyWallGeometry.DEFAULT_SCALE;
        wallGeometry.initialize(width, height, this._planeParser.floorHeight);

        let heightIterator = (parser.height - 1);

        while(heightIterator >= 0)
        {
            let widthIterator = (parser.width - 1);

            while(widthIterator >= 0)
            {
                wallGeometry.setHeight(widthIterator, heightIterator, this._planeParser.getTileHeight(widthIterator, heightIterator));
                widthIterator--;
            }

            heightIterator--;
        }

        const roomMap = this._planeParser.getMapData();

        roomMap.doors.push({
            x: doorX,
            y: doorY,
            z: doorZ,
            dir: doorDirection
        });

        const roomObject = this.getRoomPreviewOwnRoomObject();

        if(roomObject) roomObject.processUpdateMessage(new ObjectRoomMapUpdateMessage(roomMap));
    }

    public addFurnitureIntoRoom(type: string, direction: IVector3D, objectData: IObjectData = null, extra: string = null): number
    {
        if(!objectData) objectData = new LegacyDataType();

        this.reset(false);

        this._currentPreviewObjectType = type;
        this._currentPreviewObjectCategory = RoomObjectCategory.FLOOR;
        this._currentPreviewObjectData = '';
        
        if(this._roomEngine.addFurnitureFloorByTypeName(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, type, new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), direction, 0, objectData, NaN, -1, 0, -1, '', true, false))
        {
            this._previousAutomaticStateChangeTime = GetTickerTime();
            this._automaticStateChange = true;

            const roomObject = this._roomEngine.getRoomObject(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory);

            if(roomObject && extra) roomObject.model.setValue(RoomObjectVariable.FURNITURE_EXTRAS, extra);

            this.updatePreviewRoomView();

            return RoomPreviewer.PREVIEW_OBJECT_ID;
        }

        return -1;
    }

    public addWallItemIntoRoom(type: string, direction: IVector3D, objectData: string): number
    {
        if((this._currentPreviewObjectCategory === RoomObjectCategory.WALL) && (this._currentPreviewObjectType === type) && (this._currentPreviewObjectData === objectData)) return RoomPreviewer.PREVIEW_OBJECT_ID;

        this.reset(false);

        this._currentPreviewObjectType = type;
        this._currentPreviewObjectCategory = RoomObjectCategory.WALL;
        this._currentPreviewObjectData = objectData;

        if(this._roomEngine.addFurnitureWallByTypeName(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, type, new Vector3d(0.5, 2.3, 1.8), direction, 0, objectData, 0, 0, -1, '', false))
        {
            this._previousAutomaticStateChangeTime = GetTickerTime();
            this._automaticStateChange = true;

            this.updatePreviewRoomView();

            return RoomPreviewer.PREVIEW_OBJECT_ID;
        }
    }

    public addAvatarIntoRoom(figure: string, effect: number): number
    {
        this.reset(false);

        this._currentPreviewObjectType = 'avatar';
        this._currentPreviewObjectCategory = RoomObjectCategory.UNIT;
        this._currentPreviewObjectData = figure;

        if(this._roomEngine.addRoomObjectUser(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), new Vector3d(90, 0, 0), 135, RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER), figure))
        {
            this._previousAutomaticStateChangeTime = GetTickerTime();
            this._automaticStateChange = true;

            this.updateUserGesture(1);
            this.updateUserEffect(effect);
            this.updateUserPosture('std');
        }

        this.updatePreviewRoomView();

        return RoomPreviewer.PREVIEW_OBJECT_ID;
    }

    public addPetIntoRoom(figure: string): number
    {
        this.reset(false);

        this._currentPreviewObjectType = 'pet';
        this._currentPreviewObjectCategory = RoomObjectCategory.UNIT;
        this._currentPreviewObjectData = figure;

        if(this._roomEngine.addRoomObjectUser(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), new Vector3d(90, 0, 0), 90, RoomObjectUserType.getTypeNumber(RoomObjectUserType.PET), figure))
        {
            this._previousAutomaticStateChangeTime = GetTickerTime();
            this._automaticStateChange = false;

            this.updateUserGesture(1);
            this.updateUserPosture('std');
        }

        this.updatePreviewRoomView();

        return RoomPreviewer.PREVIEW_OBJECT_ID;
    }

    public updateUserPosture(type: string, parameter: string = ''): void
    {
        this._roomEngine.updateRoomObjectUserPosture(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, type, parameter);
    }

    public updateUserGesture(gestureId: number): void
    {
        this._roomEngine.updateRoomObjectUserGesture(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, gestureId);
    }

    public updateUserEffect(effectId: number): void
    {
        this._roomEngine.updateRoomObjectUserEffect(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, effectId);
    }

    public updateObjectUserFigure(figure: string, gender: string = null, subType: string = null, isRiding: boolean = false): boolean
    {
        return this._roomEngine.updateRoomObjectUserFigure(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, figure, gender, subType, isRiding);
    }

    public updateObjectUserAction(action: string, value: number, parameter: string = null): void
    {
        this._roomEngine.updateRoomObjectUserAction(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, action, value, parameter);
    }

    public updateObjectStuffData(stuffData: IObjectData): void
    {
        this._roomEngine.updateRoomObjectFloor(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, null, null, stuffData.state, stuffData);
    }

    public changeRoomObjectState(): void
    {
        this._automaticStateChange = false;

        if(this._currentPreviewObjectCategory !== RoomObjectCategory.UNIT) this._roomEngine.changeObjectState(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory);
    }

    public changeRoomObjectDirection(): void
    {
        const roomObject = this._roomEngine.getRoomObject(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory);

        if(!roomObject) return;

        const direction = this._roomEngine.objectEventHandler.getValidRoomObjectDirection(roomObject, true);

        switch(this._currentPreviewObjectCategory)
        {
            case RoomObjectCategory.FLOOR: {
                const floorLocation = new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y);
                const floorDirection = new Vector3d(direction, direction, direction);

                this._roomEngine.updateRoomObjectFloor(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, floorLocation, floorDirection, null, null);
                return;
            }
            case RoomObjectCategory.WALL:
                //this._roomEngine.updateRoomObjectWall(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, null, direction, null, null);
                return;
        }
    }

    private checkAutomaticRoomObjectStateChange(): void
    {
        if(this._automaticStateChange)
        {
            const time = GetTickerTime();

            if(time > (this._previousAutomaticStateChangeTime + RoomPreviewer.AUTOMATIC_STATE_CHANGE_INTERVAL))
            {
                this._previousAutomaticStateChangeTime = time;

                this._roomEngine.changeObjectState(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory);
            }
        }
    }

    public getRoomCanvas(width: number, height: number): Container
    {
        const displayObject = this._roomEngine.getRoomInstanceDisplay(this._previewRoomId, RoomPreviewer.PREVIEW_CANVAS_ID, width, height, this._currentPreviewScale);

        this._roomEngine.setRoomInstanceRenderingCanvasMask(this._previewRoomId, RoomPreviewer.PREVIEW_CANVAS_ID, true);

        const geometry = this._roomEngine.getRoomInstanceGeometry(this._previewRoomId, RoomPreviewer.PREVIEW_CANVAS_ID);

        //if(geometry) geometry.adjustLocation(new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), 30);

        this._currentPreviewCanvasWidth = width;
        this._currentPreviewCanvasHeight = height;

        return displayObject;
    }

    public modifyRoomCanvas(width: number, height: number): void
    {
        this._currentPreviewCanvasWidth = width;
        this._currentPreviewCanvasHeight = height;

        this._roomEngine.initializeRoomInstanceRenderingCanvas(this._previewRoomId, RoomPreviewer.PREVIEW_CANVAS_ID, width, height);
    }

    public updatePreviewObjectBoundingRectangle(point: Point): void
    {
        const objectBounds = this._roomEngine.getRoomObjectBoundingRectangle(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory, RoomPreviewer.PREVIEW_CANVAS_ID);

        if(objectBounds && point)
        {
            objectBounds.x += -(this._currentPreviewCanvasWidth >> 1);
            objectBounds.y += -(this._currentPreviewCanvasHeight >> 1);

            objectBounds.x += -(point.x);
            objectBounds.y += -(point.y);

            if(!this._currentPreviewRectangle)
            {
                this._currentPreviewRectangle = objectBounds;
            }
            else
            {
                const bounds = this._currentPreviewRectangle.clone().enlarge(objectBounds);

                if(((((bounds.width - this._currentPreviewRectangle.width) > ((this._currentPreviewCanvasWidth - this._currentPreviewRectangle.width) >> 1)) || ((bounds.height - this._currentPreviewRectangle.height) > ((this._currentPreviewCanvasHeight - this._currentPreviewRectangle.height) >> 1))) || (this._currentPreviewRectangle.width < 1)) || (this._currentPreviewRectangle.height < 1)) this._currentPreviewRectangle = bounds;
            }
        }
    }

    public updateAvatarDirection(direction: number, headDirection: number): void
    {
        this._roomEngine.updateRoomObjectUserLocation(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), new Vector3d(RoomPreviewer.PREVIEW_OBJECT_LOCATION_X, RoomPreviewer.PREVIEW_OBJECT_LOCATION_Y, 0), false, 0, new Vector3d((direction * 45), 0, 0), (headDirection * 45));
    }

    public updateObjectRoom(floorType: string = null, wallType: string = null, landscapeType: string = null, _arg_4: boolean = false): boolean
    {
        return this._roomEngine.updateRoomInstancePlaneType(this._previewRoomId, floorType, wallType, landscapeType, _arg_4);
    }

    public updateRoomWallsAndFloorVisibility(wallsVisible: boolean, floorsVisible: boolean = true): void
    {
        this._roomEngine.updateRoomInstancePlaneVisibility(this._previewRoomId, wallsVisible, floorsVisible);
    }

    public updatePreviewRoomView(k: boolean = false): void
    {
        if(this._disableUpdate && !k) return;

        this.checkAutomaticRoomObjectStateChange();
    }

    private onRoomInitializedonRoomInitialized(event: RoomEngineEvent): void
    {
        if(!event || (event.type !== RoomEngineEvent.INITIALIZED)) return;
        
        if(event.roomId === this._previewRoomId) this._roomEngine.updateRoomInstancePlaneType(this._previewRoomId, '110', '99999');
    }

    private onRoomObjectAdded(event: RoomEngineObjectEvent): void
    {
        if((event.roomId === this._previewRoomId) && (event.objectId === RoomPreviewer.PREVIEW_OBJECT_ID) && (event.category === this._currentPreviewObjectCategory))
        {
            this._currentPreviewRectangle = null;

            const roomObject = this._roomEngine.getRoomObject(event.roomId, event.objectId, event.category);

            if(roomObject && roomObject.model && (event.category === RoomObjectCategory.WALL))
            {
                const sizeZ = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_SIZE_Z);
                const centerZ = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_CENTER_Z);

                if((sizeZ !== null) || (centerZ !== null))
                {
                    this._roomEngine.updateRoomObjectWallLocation(event.roomId, event.objectId, new Vector3d(0.5, 2.3, (((3.6 - sizeZ) / 2) + centerZ)));
                }
            }
        }
    }

    public getRenderingCanvas(): IRoomRenderingCanvas
    {
        return this._roomEngine.getRoomInstanceRenderingCanvas(this._previewRoomId, RoomPreviewer.PREVIEW_CANVAS_ID);
    }

    public getRoomPreviewObject(): IRoomObjectController
    {
        return this._roomEngine.getRoomObject(this._previewRoomId, RoomPreviewer.PREVIEW_OBJECT_ID, this._currentPreviewObjectCategory);
    }

    public getRoomPreviewOwnRoomObject(): IRoomObjectController
    {
        return this._roomEngine.getRoomObject(this._previewRoomId, RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM);
    }

    public get roomId(): number
    {
        return this._previewRoomId;
    }

    public get width(): number
    {
        return this._currentPreviewCanvasWidth;
    }

    public get height(): number
    {
        return this._currentPreviewCanvasHeight;
    }
}
