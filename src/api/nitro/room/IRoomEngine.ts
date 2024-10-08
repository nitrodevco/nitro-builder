import { Container, Point, Rectangle } from 'pixi.js';
import { IVector3D } from '../../utils';
import { IPetCustomPart } from '../pet';
import { IRoomSessionManager, ISessionDataManager } from '../session';
import { IImageResult } from './IImageResult';
import { IPetColorResult } from './IPetColorResult';
import { IRoomInstance } from './IRoomInstance';
import { ISelectedRoomObjectData } from './ISelectedRoomObjectData';
import { IObjectData, IRoomMapData, IRoomObject, IRoomObjectController } from './object';
import { IRoomRenderingCanvas } from './renderer';
import { IFurnitureStackingHeightMap, ILegacyWallGeometry, IRoomCamera, IRoomGeometry } from './utils';

export interface IRoomEngine
{

    activeRoomId: number;
    addFurnitureFloor(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra?: number, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, synchronized?: boolean, realRoomObject?: boolean, sizeZ?: number): boolean;
    addFurnitureFloorByTypeName(roomId: number, id: number, typeName: string, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra?: number, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, synchronized?: boolean, realRoomObject?: boolean, sizeZ?: number): boolean;
    addFurnitureWall(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, extra: string, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, realRoomObject?: boolean): boolean;
    addFurnitureWallByTypeName(roomId: number, id: number, typeName: string, location: IVector3D, direction: IVector3D, state: number, extra: string, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, realRoomObject?: boolean): boolean;
    addRoomInstanceFloorHole(roomId: number, objectId: number): void;
    addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, headDirection: number, type: number, figure: string): boolean;
    cancelRoomObjectInsert(): void;
    cancelRoomObjectPlacement(): void;
    changeObjectModelData(roomId: number, objectId: number, category: number, numberKey: string, numberValue: number): boolean;
    changeObjectState(roomId: number, objectId: number, category: number): void;
    createRoomInstance(roomId: number, roomMap: IRoomMapData): void;
    deleteRoomObject(objectId: number, objectCategory: number): boolean;
    destroyRoom(id: number): void;
    dispatchMouseEvent(canvasId: number, x: number, y: number, type: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean, buttonDown: boolean): void;
    getActiveRoomInstanceRenderingCanvas(): IRoomRenderingCanvas;
    getFurnitureFloorIcon(typeId: number, extras?: string, objectData?: IObjectData): IImageResult;
    getFurnitureFloorImage(typeId: number, direction: IVector3D, scale: number, bgColor?: number, extras?: string, state?: number, frameCount?: number, objectData?: IObjectData): IImageResult;
    getFurnitureFloorName(typeId: number): string;
    getFurnitureStackingHeightMap(roomId: number): IFurnitureStackingHeightMap;
    getFurnitureWallIcon(typeId: number, extras?: string): IImageResult;
    getFurnitureWallImage(typeId: number, direction: IVector3D, scale: number, bgColor?: number, extras?: string, state?: number, frameCount?: number): IImageResult;
    getFurnitureWallName(typeId: number, extra?: string): string;
    getGenericRoomObjectImage(type: string, value: string, direction: IVector3D, scale: number, bgColor?: number, extras?: string, objectData?: IObjectData, state?: number, frameCount?: number, posture?: string, originalId?: number): IImageResult;
    getLegacyWallGeometry(roomId: number): ILegacyWallGeometry;
    getPetColorResult(petIndex: number, paletteIndex: number): IPetColorResult;
    getPetColorResultsForTag(petIndex: number, tagName: string): IPetColorResult[];
    getPetTypeId(figure: string): number;
    getPlacedRoomObjectData(roomId: number): ISelectedRoomObjectData;
    getRoomInstance(roomId: number): IRoomInstance;
    getRoomInstanceDisplay(roomId: number, id: number, width: number, height: number, scale: number): Container;
    getRoomInstanceGeometry(roomId: number, canvasId?: number): IRoomGeometry;
    getRoomInstanceRenderingCanvas(roomId: number, canvasId?: number): IRoomRenderingCanvas;
    getRoomInstanceRenderingCanvasOffset(roomId: number, canvasId?: number): Point;
    getRoomInstanceRenderingCanvasScale(roomId?: number, canvasId?: number): number;
    getRoomInstanceVariable<T>(roomId: number, key: string): T;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectBoundingRectangle(roomId: number, objectId: number, category: number, canvasId: number): Rectangle;
    getRoomObjectByIndex(roomId: number, index: number, category: number): IRoomObjectController;
    getRoomObjectCategoryForType(type: string): number;
    getRoomObjectCount(roomId: number, categoryId: number): number;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    getRoomObjectFloor(roomId: number, objectId: number): IRoomObjectController;
    getRoomObjectImage(roomId: number, objectId: number, category: number, direction: IVector3D, scale: number, bgColor?: number): IImageResult;
    getRoomObjectPetImage(typeId: number, paletteId: number, color: number, direction: IVector3D, scale: number, headOnly?: boolean, bgColor?: number, customParts?: IPetCustomPart[], posture?: string): IImageResult;
    getRoomObjects(roomId: number, category: number): IRoomObject[];
    getRoomObjectScreenLocation(roomId: number, objectId: number, objectType: number, canvasId?: number): Point;
    getRoomObjectSelectionArrow(roomId: number): IRoomObjectController;
    getRoomObjectUser(roomId: number, objectId: number): IRoomObjectController;
    getRoomCamera(roomId: number): IRoomCamera;
    getSelectedRoomObjectData(roomId: number): ISelectedRoomObjectData;
    getTotalObjectsForManager(roomId: number, category: number): number;
    init(): Promise<void>;
    initalizeTemporaryObjectsByType(type: string, _arg_2: boolean): void;
    initializeRoomInstanceRenderingCanvas(roomId: number, canvasId: number, width: number, height: number): void;
    isDecorating: boolean;
    isPlayingGame(): boolean;
    modifyRoomObjectData(objectId: number, category: number, colorHex: string, data: string): boolean
    modifyRoomObjectDataWithMap(objectId: number, category: number, operation: string, data: Map<string, string>): boolean
    objectInitialized(roomId: string, objectId: number, category: number): void;
    processRoomObjectOperation(objectId: number, category: number, operation: string): boolean;
    processRoomObjectPlacement(placementSource: string, id: number, category: number, typeId: number, legacyString?: string, stuffData?: IObjectData, state?: number, frameNumber?: number, posture?: string): boolean;
    removeObjectMoverIconSprite(): void;
    removeRoomInstance(roomId: number): void;
    removeRoomInstanceFloorHole(roomId: number, objectId: number): void;
    removeRoomObjectFloor(roomId: number, objectId: number, userId?: number, _arg_4?: boolean): void;
    removeRoomObjectUser(roomId: number, objectId: number): void;
    removeRoomObjectWall(roomId: number, objectId: number, userId?: number): void;
    rollRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void;
    roomSessionManager: IRoomSessionManager;
    selectRoomObject(roomId: number, objectId: number, objectCategory: number): void;
    sessionDataManager: ISessionDataManager;
    setActiveRoomId(roomId: number): void;
    setFurnitureStackingHeightMap(roomId: number, heightMap: IFurnitureStackingHeightMap): void;
    setObjectMoverIconSprite(objectId: number, category: number, _arg_3: boolean, instanceData?: string, stuffData?: IObjectData, state?: number, frameNumber?: number, posture?: string): void;
    setObjectMoverIconSpriteVisible(k: boolean): void;
    setPlacedRoomObjectData(roomId: number, data: ISelectedRoomObjectData): void;
    setRoomEngineGameMode(roomId: number, isPlaying: boolean): void;
    setRoomInstanceModelName(roomId: number, name: string): void;
    setRoomInstanceRenderingCanvasMask(roomId: number, canvasId: number, flag: boolean): void;
    setRoomInstanceRenderingCanvasOffset(roomId: number, canvasId: number, point: Point): boolean;
    setRoomInstanceRenderingCanvasScale(roomId: number, canvasId: number, scale: number, point?: Point, offsetPoint?: Point): void;
    setRoomSessionOwnUser(roomId: number, objectId: number): void;
    setSelectedAvatar(roomId: number, objectId: number): void;
    setSelectedRoomObjectData(roomId: number, data: ISelectedRoomObjectData): void;
    update(flag?: boolean): void;
    updateMousePointer(type: string, objectId: number, objectType: string): void;
    updateObjectRoomColor(k: number, _arg_2: number, _arg_3: number, _arg_4: boolean): boolean;
    updateRoomInstancePlaneThickness(roomId: number, wallThickness: number, floorThickness: number): boolean;
    updateRoomInstancePlaneType(roomId: number, floorType?: string, wallType?: string, landscapeType?: string, _arg_5?: boolean): boolean;
    updateRoomInstancePlaneVisibility(roomId: number, wallVisible: boolean, floorVisible?: boolean): boolean;
    updateRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra?: number): boolean;
    updateRoomObjectFloorExpiration(roomId: number, objectId: number, expires: number): boolean;
    updateRoomObjectFloorHeight(roomId: number, objectId: number, height: number): boolean;
    updateRoomObjectMask(roomId: number, objectId: number, _arg_?: boolean): void;
    updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): boolean;
    updateRoomObjectUserEffect(roomId: number, objectId: number, effectId: number, delay?: number): boolean;
    updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender?: string, subType?: string, isRiding?: boolean): boolean;
    updateRoomObjectUserFlatControl(roomId: number, objectId: number, level: string): boolean;
    updateRoomObjectUserGesture(roomId: number, objectId: number, gestureId: number): boolean;
    updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp?: boolean, baseY?: number, direction?: IVector3D, headDirection?: number): boolean;
    updateRoomObjectUserOwn(roomId: number, objectId: number): void;
    updateRoomObjectUserPetGesture(roomId: number, objectId: number, gesture: string): boolean;
    updateRoomObjectUserPosture(roomId: number, objectId: number, type: string, parameter?: string): boolean;
    updateRoomObjectWall(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, extra?: string): boolean;
    updateRoomObjectWallExpiration(roomId: number, objectId: number, expires: number): boolean;
    updateRoomObjectWallItemData(roomId: number, objectId: number, data: string): boolean;
    updateRoomObjectWallLocation(roomId: number, objectId: number, location: IVector3D): boolean;
    useRoomObject(objectId: number, category: number): boolean;
}
