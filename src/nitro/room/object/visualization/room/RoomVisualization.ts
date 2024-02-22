import { Rectangle } from 'pixi.js';
import { AlphaTolerance, IObjectVisualizationData, IPlaneVisualization, IRoomGeometry, IRoomObjectModel, IRoomObjectSprite, IRoomPlane, RoomObjectSpriteType, RoomObjectVariable, ToInt32, Vector3d } from '../../../../../api';
import { RoomObjectSpriteVisualization } from '../../RoomObjectSpriteVisualization';
import { RoomMapData } from './RoomMapData';
import { RoomPlane } from './RoomPlane';
import { RoomPlaneData } from './RoomPlaneData';
import { RoomPlaneParser } from './RoomPlaneParser';
import { RoomVisualizationData } from './RoomVisualizationData';

export class RoomVisualization extends RoomObjectSpriteVisualization implements IPlaneVisualization
{
    public static FLOOR_COLOR: number = 0xFFFFFF;
    public static FLOOR_COLOR_LEFT: number = 0xDDDDDD;
    public static FLOOR_COLOR_RIGHT: number = 0xBBBBBB;
    private static WALL_COLOR_TOP: number = 0xFFFFFF;
    private static WALL_COLOR_SIDE: number = 0xCCCCCC;
    private static WALL_COLOR_BOTTOM: number = 0x999999;
    private static WALL_COLOR_BORDER: number = 0x999999;
    public static LANDSCAPE_COLOR_TOP: number = 0xFFFFFF;
    public static LANDSCAPE_COLOR_SIDE: number = 0xCCCCCC;
    public static LANDSCAPE_COLOR_BOTTOM: number = 0x999999;
    private static ROOM_DEPTH_OFFSET: number = 1000;

    protected _data: RoomVisualizationData;

    private _roomPlaneParser: RoomPlaneParser;

    private _geometryUpdateId: number;
    private _boundingRectangle: Rectangle;
    private _directionX: number;
    private _directionY: number;
    private _directionZ: number;
    private _floorThickness: number;
    private _wallThickness: number;
    private _holeUpdateTime: number;
    private _planes: RoomPlane[];
    private _visiblePlanes: RoomPlane[];
    private _visiblePlaneSpriteNumbers: number[];
    private _roomScale: number;
    private _colorBackgroundOnly: boolean;
    private _redColor: number;
    private _greenColor: number;
    private _blueColor: number;
    private _typeVisibility: boolean[];
    private _assetUpdateCounter: number;
    private _isPlaneSet: boolean;

    constructor()
    {
        super();

        this._data = null;

        this._roomPlaneParser = new RoomPlaneParser();

        this._geometryUpdateId = -1;
        this._directionX = 0;
        this._directionY = 0;
        this._directionZ = 0;
        this._floorThickness = 1;
        this._wallThickness = 1;
        this._holeUpdateTime = NaN;
        this._planes = [];
        this._visiblePlanes = [];
        this._visiblePlaneSpriteNumbers = [];
        this._roomScale = 0;
        this._colorBackgroundOnly = true;
        this._redColor = 0xFF;
        this._greenColor = 0xFF;
        this._blueColor = 0xFF;
        this._typeVisibility = [];
        this._assetUpdateCounter = 0;
        this._isPlaneSet = false;

        this._typeVisibility[RoomPlane.TYPE_UNDEFINED] = false;
        this._typeVisibility[RoomPlane.TYPE_FLOOR] = true;
        this._typeVisibility[RoomPlane.TYPE_WALL] = true;
        this._typeVisibility[RoomPlane.TYPE_LANDSCAPE] = true;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof RoomVisualizationData)) return false;

        this._data = data;

        super.initialize(data);

        this._data.setGraphicAssetCollection(this.asset);

        return true;
    }

    public dispose(): void
    {
        super.dispose();

        this.clearPlanes();

        this._planes = null;
        this._visiblePlanes = null;
        this._visiblePlaneSpriteNumbers = null;

        if(this._roomPlaneParser)
        {
            this._roomPlaneParser.dispose();

            this._roomPlaneParser = null;
        }

        if(this._data)
        {
            this._data = null;
        }
    }

    protected reset(): void
    {
        super.reset();

        this._geometryUpdateId = -1;
        this._roomScale = 0;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!this.object || !geometry) return;

        const geometryUpdate = this.updateGeometry(geometry);
        const objectModel = this.object.model;

        let needsUpdate = geometryUpdate;

        if(this.updateThickness(objectModel)) needsUpdate = true;

        if(this.updateHole(objectModel)) needsUpdate = true;

        if(!needsUpdate) return;

        this.initializeRoomPlanes();
        this.updatePlaneTexturesAndVisibilities(objectModel);
        this.updatePlanes(geometry, geometryUpdate, time);

        let index = 0;

        while(index < this._visiblePlanes.length)
        {
            const spriteIndex = this._visiblePlaneSpriteNumbers[index];
            const sprite = this.getSprite(spriteIndex);
            const plane = this._visiblePlanes[index];

            if(sprite && plane && (plane.type !== RoomPlane.TYPE_LANDSCAPE))
            {
                if(this._colorBackgroundOnly)
                {
                    let _local_14 = plane.color;

                    const _local_15 = (((_local_14 & 0xFF) * this._redColor) / 0xFF);
                    const _local_16 = ((((_local_14 >> 8) & 0xFF) * this._greenColor) / 0xFF);
                    const _local_17 = ((((_local_14 >> 16) & 0xFF) * this._blueColor) / 0xFF);
                    const _local_18 = (_local_14 >> 24);

                    _local_14 = ((((_local_18 << 24) + (_local_17 << 16)) + (_local_16 << 8)) + _local_15);

                    sprite.color = _local_14;
                }
                else
                {
                    sprite.color = plane.color;
                }
            }

            index++;
        }

        this.updateSpriteCounter++;

        this.updateModelCounter = objectModel.updateCounter;
    }

    private updateGeometry(k: IRoomGeometry): boolean
    {
        if(!k) return false;

        if(this._geometryUpdateId === k.updateId) return false;

        this._geometryUpdateId = k.updateId;
        this._boundingRectangle = null;

        const direction = k.direction;

        if(direction && ((direction.x !== this._directionX) || (direction.y !== this._directionY) || (direction.z !== this._directionZ) || (k.scale !== this._roomScale)))
        {
            this._directionX = direction.x;
            this._directionY = direction.y;
            this._directionZ = direction.z;
            this._roomScale = k.scale;

            return true;
        }

        return false;
    }

    private updateThickness(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        const floorThickness = k.getValue<number>(RoomObjectVariable.ROOM_FLOOR_THICKNESS);
        const wallThickness = k.getValue<number>(RoomObjectVariable.ROOM_WALL_THICKNESS);

        if((!isNaN(floorThickness) && !isNaN(wallThickness)) && ((floorThickness !== this._floorThickness) || (wallThickness !== this._wallThickness)))
        {
            this._floorThickness = floorThickness;
            this._wallThickness = wallThickness;

            this.clearPlanes();

            return true;
        }

        return false;
    }

    private updateHole(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        const holeUpdate = k.getValue<number>(RoomObjectVariable.ROOM_FLOOR_HOLE_UPDATE_TIME);

        if(!isNaN(holeUpdate) && (holeUpdate !== this._holeUpdateTime))
        {
            this._holeUpdateTime = holeUpdate;

            this.clearPlanes();

            return true;
        }

        return false;
    }

    private updatePlaneTexturesAndVisibilities(model: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === model.updateCounter) return false;

        const floorVisibility = (model.getValue<number>(RoomObjectVariable.ROOM_FLOOR_VISIBILITY) === 1);
        const wallVisibility = (model.getValue<number>(RoomObjectVariable.ROOM_WALL_VISIBILITY) === 1);
        const landscapeVisibility = (model.getValue<number>(RoomObjectVariable.ROOM_LANDSCAPE_VISIBILITY) === 1);

        return (this.updatePlaneVisibility(floorVisibility, wallVisibility, landscapeVisibility));
    }

    private clearPlanes(): void
    {
        if(this._planes)
        {
            while(this._planes.length)
            {
                const plane = this._planes[0];

                if(plane) plane.dispose();

                this._planes.pop();
            }

            this._planes = [];
            this._planes = [];
        }

        this._isPlaneSet = false;
        this._assetUpdateCounter = (this._assetUpdateCounter + 1);

        this.reset();
    }

    protected initializeRoomPlanes(): void
    {
        if(!this.object || this._isPlaneSet) return;

        if(!isNaN(this._floorThickness)) this._roomPlaneParser.floorThicknessMultiplier = this._floorThickness;
        if(!isNaN(this._wallThickness)) this._roomPlaneParser.wallThicknessMultiplier = this._wallThickness;

        const mapData = this.object.model.getValue<RoomMapData>(RoomObjectVariable.ROOM_MAP_DATA);

        if(!this._roomPlaneParser.initializeFromMapData(mapData)) return;

        let _local_5 = 0;
        let randomSeed = this.object.model.getValue<number>(RoomObjectVariable.ROOM_RANDOM_SEED);
        let index = 0;

        while(index < this._roomPlaneParser.planeCount)
        {
            const location = this._roomPlaneParser.getPlaneLocation(index);
            const leftSide = this._roomPlaneParser.getPlaneLeftSide(index);
            const rightSide = this._roomPlaneParser.getPlaneRightSide(index);
            const secondaryNormals = this._roomPlaneParser.getPlaneSecondaryNormals(index);
            const planeType = this._roomPlaneParser.getPlaneType(index);

            let plane: RoomPlane = null;

            if(location && leftSide && rightSide)
            {
                const _local_14 = Vector3d.crossProduct(leftSide, rightSide);

                randomSeed = ToInt32(Math.trunc((randomSeed * 7613) + 517) >>> 0);
                plane = null;

                if(planeType === RoomPlaneData.PLANE_FLOOR) 
                {
                    const _local_15 = ((location.x + leftSide.x) + 0.5);
                    const _local_16 = ((location.y + rightSide.y) + 0.5);
                    const textureOffsetX = (Math.trunc(_local_15) - _local_15);
                    const textureOffsetY = (Math.trunc(_local_16) - _local_16);

                    plane = new RoomPlane(this.object.getLocation(), location, leftSide, rightSide, RoomPlane.TYPE_FLOOR, true, secondaryNormals, randomSeed, -(textureOffsetX), -(textureOffsetY));

                    plane.color = (_local_14.z !== 0) ? RoomVisualization.FLOOR_COLOR : ((_local_14.x !== 0) ? RoomVisualization.FLOOR_COLOR_RIGHT : RoomVisualization.FLOOR_COLOR_LEFT);
                }

                else if(planeType === RoomPlaneData.PLANE_WALL)
                {
                    plane = new RoomPlane(this.object.getLocation(), location, leftSide, rightSide, RoomPlane.TYPE_WALL, true, secondaryNormals, randomSeed);

                    plane.color = ((_local_14.x === 0) && (_local_14.y === 0)) ? RoomVisualization.WALL_COLOR_BORDER : ((_local_14.y > 0) ? RoomVisualization.WALL_COLOR_TOP : ((_local_14.y === 0) ? RoomVisualization.WALL_COLOR_SIDE : RoomVisualization.WALL_COLOR_BOTTOM));
                }

                if(plane) this._planes.push(plane);
            }
            else
            {
                return;
            }

            index++;
        }

        this._isPlaneSet = true;
        this.defineSprites();
    }

    protected defineSprites(): void
    {
        this.createSprites(this._planes.length);

        let planeIndex = 0;

        while(planeIndex < this._planes.length)
        {
            const plane = this._planes[planeIndex];
            const sprite = this.getSprite(planeIndex);

            if(plane && sprite && plane.leftSide && plane.rightSide)
            {
                if((plane.type === RoomPlane.TYPE_WALL) && ((plane.leftSide.length < 1) || (plane.rightSide.length < 1)))
                {
                    sprite.alphaTolerance = AlphaTolerance.MATCH_NOTHING;
                }
                else
                {
                    sprite.alphaTolerance = AlphaTolerance.MATCH_OPAQUE_PIXELS;
                }

                if(plane.type === RoomPlane.TYPE_WALL)
                {
                    sprite.tag = 'plane.wall@' + (planeIndex + 1);
                }

                else if(plane.type === RoomPlane.TYPE_FLOOR)
                {
                    sprite.tag = 'plane.floor@' + (planeIndex + 1);
                }

                else
                {
                    sprite.tag = 'plane@' + (planeIndex + 1);
                }

                sprite.spriteType = RoomObjectSpriteType.ROOM_PLANE;
            }

            planeIndex++;
        }
    }

    private updatePlaneVisibility(k: boolean, _arg_2: boolean, _arg_3: boolean): boolean
    {
        if((k === this._typeVisibility[RoomPlane.TYPE_FLOOR]) && (_arg_2 === this._typeVisibility[RoomPlane.TYPE_WALL]) && (_arg_3 === this._typeVisibility[RoomPlane.TYPE_LANDSCAPE])) return false;

        this._typeVisibility[RoomPlane.TYPE_FLOOR] = k;
        this._typeVisibility[RoomPlane.TYPE_WALL] = _arg_2;
        this._typeVisibility[RoomPlane.TYPE_LANDSCAPE] = _arg_3;

        this._visiblePlanes = [];
        this._visiblePlaneSpriteNumbers = [];

        return true;
    }

    protected updatePlanes(geometry: IRoomGeometry, geometryUpdate: boolean, timeSinceStartMs: number): boolean
    {
        if(!geometry || !this.object) return false;

        this._assetUpdateCounter++;

        if(geometryUpdate)
        {
            this._visiblePlanes = [];
            this._visiblePlaneSpriteNumbers = [];
        }

        const hasVisiblePlanes = (this._visiblePlanes.length > 0);

        let visiblePlanes = this._visiblePlanes;

        if(!this._visiblePlanes.length) visiblePlanes = this._planes;

        let depth = 0;
        let updated = false;
        let index = 0;

        while(index < visiblePlanes.length)
        {
            let id = index;

            if(hasVisiblePlanes) id = this._visiblePlaneSpriteNumbers[index];

            const sprite = this.getSprite(id);

            if(sprite)
            {
                const plane = visiblePlanes[index];

                if(plane)
                {
                    sprite.id = plane.uniqueId;

                    if(plane.update(geometry, timeSinceStartMs))
                    {
                        if(plane.visible)
                        {
                            depth = ((plane.relativeDepth + this.floorRelativeDepth) + (id / 1000));

                            if(plane.type !== RoomPlane.TYPE_FLOOR)
                            {
                                depth = ((plane.relativeDepth + this.wallRelativeDepth) + (id / 1000));

                                if((plane.leftSide.length < 1) || (plane.rightSide.length < 1))
                                {
                                    depth = (depth + (RoomVisualization.ROOM_DEPTH_OFFSET * 0.5));
                                }
                            }

                            this.updateSprite(sprite, geometry, plane, `plane ${ id } ${ geometry.scale }`, depth);
                        }

                        updated = true;
                    }

                    if(sprite.visible != ((plane.visible) && (this._typeVisibility[plane.type])))
                    {
                        sprite.visible = (!(sprite.visible));
                        updated = true;
                    }

                    if(sprite.visible)
                    {
                        if(!hasVisiblePlanes)
                        {
                            this._visiblePlanes.push(plane);
                            this._visiblePlaneSpriteNumbers.push(index);
                        }
                    }
                }
                else
                {
                    sprite.id = 0;

                    if(sprite.visible)
                    {
                        sprite.visible = false;
                        updated = true;
                    }
                }
            }

            index++;
        }

        return updated;
    }

    private updateSprite(sprite: IRoomObjectSprite, geometry: IRoomGeometry, plane: RoomPlane, _arg_3: string, relativeDepth: number): void
    {
        const offset = plane.offset;

        sprite.offsetX = -(offset.x);
        sprite.offsetY = -(offset.y);
        sprite.relativeDepth = relativeDepth;
        sprite.color = plane.color;
        sprite.texture = plane.planeTexture;
        sprite.name = ((_arg_3 + '_') + this._assetUpdateCounter);
    }

    public getBoundingRectangle(): Rectangle
    {
        if(!this._boundingRectangle) this._boundingRectangle = super.getBoundingRectangle();

        return new Rectangle(this._boundingRectangle.x, this._boundingRectangle.y, this._boundingRectangle.width, this._boundingRectangle.height);
    }

    public get planes(): IRoomPlane[]
    {
        const planes: IRoomPlane[] = [];

        for(const plane of this._visiblePlanes) planes.push(plane);

        return planes;
    }

    public get floorRelativeDepth(): number
    {
        return RoomVisualization.ROOM_DEPTH_OFFSET + 0.1;
    }

    public get wallRelativeDepth(): number
    {
        return RoomVisualization.ROOM_DEPTH_OFFSET + 0.5;
    }
}
