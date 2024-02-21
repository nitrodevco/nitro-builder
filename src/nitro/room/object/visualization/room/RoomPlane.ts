import { Container, Matrix, Point, Sprite, Texture, TilingSprite } from 'pixi.js';
import { IRoomGeometry, IRoomPlane, IVector3D, TextureUtils, Vector3d } from '../../../../../api';
import { RoomPlaneBitmapMask } from './RoomPlaneBitmapMask';
import { RoomPlaneRectangleMask } from './RoomPlaneRectangleMask';
import { PlaneMaskManager } from './mask';
import { Randomizer } from './utils';

export class RoomPlane implements IRoomPlane
{
    private static ZERO_POINT: Point = new Point(0, 0);
    public static TYPE_UNDEFINED: number = 0;
    public static TYPE_WALL: number = 1;
    public static TYPE_FLOOR: number = 2;
    public static TYPE_LANDSCAPE: number = 3;
    private static _uniqueIdCounter: number = 1;

    private _disposed: boolean;
    private _randomSeed: number;
    private _origin: Vector3d;
    private _location: Vector3d;
    private _leftSide: Vector3d;
    private _rightSide: Vector3d;
    private _normal: Vector3d;
    private _secondaryNormals: Vector3d[];
    private _geometryUpdateId: number;
    private _type: number;
    private _isVisible: boolean;
    private _hasTexture: boolean;
    private _offset: Point;
    private _relativeDepth: number;
    private _color: number;
    private _maskManager: PlaneMaskManager = null;
    private _id: string;
    private _uniqueId: number;
    private _textureOffsetX: number;
    private _textureOffsetY: number;
    private _textureMaxX: number;
    private _textureMaxY: number;
    private _useMask: boolean;
    private _bitmapMasks: RoomPlaneBitmapMask[];
    private _rectangleMasks: RoomPlaneRectangleMask[];
    private _bitmapMasksOld: RoomPlaneBitmapMask[];
    private _rectangleMasksOld: RoomPlaneRectangleMask[];
    private _maskChanged: boolean;
    private _cornerA: Vector3d;
    private _cornerB: Vector3d;
    private _cornerC: Vector3d;
    private _cornerD: Vector3d;
    private _width: number = 0;
    private _height: number = 0;
    private _canBeVisible: boolean;

    private _planeContainer: Container = null;
    private _tilingSprite: TilingSprite = null;
    private _planeTexture: Texture = null;
    private _maskTexture: Texture = null;

    constructor(origin: IVector3D, location: IVector3D, leftSide: IVector3D, rightSide: IVector3D, type: number, usesMask: boolean, secondaryNormals: IVector3D[], randomSeed: number, textureOffsetX: number = 0, textureOffsetY: number = 0, textureMaxX: number = 0, textureMaxY: number = 0)
    {
        this._secondaryNormals = [];
        this._bitmapMasks = [];
        this._rectangleMasks = [];
        this._bitmapMasksOld = [];
        this._rectangleMasksOld = [];
        this._randomSeed = randomSeed;
        this._maskChanged = false;
        this._origin = new Vector3d();
        this._origin.assign(origin);
        this._location = new Vector3d();
        this._location.assign(location);
        this._leftSide = new Vector3d();
        this._leftSide.assign(leftSide);
        this._rightSide = new Vector3d();
        this._rightSide.assign(rightSide);
        this._normal = Vector3d.crossProduct(this._leftSide, this._rightSide);

        if(this._normal.length > 0)
        {
            this._normal.multiply((1 / this._normal.length));
        }

        if(secondaryNormals != null)
        {
            for(const entry of secondaryNormals)
            {
                if(!entry) continue;

                const vector = new Vector3d();

                vector.assign(entry);

                this._secondaryNormals.push(vector);
            }
        }
        this._disposed = false;
        this._isVisible = false;
        this._id = null;
        this._hasTexture = true;
        this._geometryUpdateId = -1;
        this._offset = new Point();
        this._relativeDepth = 0;
        this._type = type;
        this._color = 0;
        this._canBeVisible = true;
        this._cornerA = new Vector3d();
        this._cornerB = new Vector3d();
        this._cornerC = new Vector3d();
        this._cornerD = new Vector3d();
        this._width = 0;
        this._height = 0;
        this._textureOffsetX = textureOffsetX;
        this._textureOffsetY = textureOffsetY;
        this._textureMaxX = textureMaxX;
        this._textureMaxY = textureMaxY;
        this._useMask = usesMask;
        this._uniqueId = ++RoomPlane._uniqueIdCounter;
    }

    public dispose(): void
    {
        this._location = null;
        this._origin = null;
        this._leftSide = null;
        this._rightSide = null;
        this._normal = null;
        this._cornerA = null;
        this._cornerB = null;
        this._cornerC = null;
        this._cornerD = null;
        this._bitmapMasks = null;
        this._rectangleMasks = null;

        this._disposed = true;
    }

    private needsNewTexture(geometry: IRoomGeometry, timeSinceStartMs: number): boolean
    {
        if(!geometry) return false;

        if(this._canBeVisible && (!this._planeContainer || this._maskChanged)) return true;

        // eventually we will check if we are animated and need to update that

        return false;
    }

    private updatePlane(geometry: IRoomGeometry, timeSinceStartMs: number, width: number, height: number, normal: IVector3D): void
    {
        if(this.needsNewTexture(geometry, timeSinceStartMs))
        {
            if(!this._planeContainer) this._planeContainer = new Container();

            if(!this._tilingSprite)
            {
                this._tilingSprite = new TilingSprite({
                    texture: Texture.WHITE,
                    tint: 0xFF0000,
                    width: width,
                    height: height,
                    applyAnchorToTexture: true
                });

                this._planeContainer.addChild(this._tilingSprite);
            }
            else
            {
                this._tilingSprite.texture = Texture.WHITE;
                this._tilingSprite.width = width;
                this._tilingSprite.height = height;
            }
        }

        return null;
    }

    public update(geometry: IRoomGeometry, timeSinceStartMs: number): boolean
    {
        if(!geometry || this._disposed) return false;

        let geometryChanged = false;

        if(this._geometryUpdateId != geometry.updateId) geometryChanged = true;

        if(!geometryChanged || !this._canBeVisible)
        {
            if(!this.visible) return false;
        }

        if(geometryChanged)
        {
            let cosAngle = 0;

            cosAngle = Vector3d.cosAngle(geometry.directionAxis, this.normal);

            if(cosAngle > -0.001)
            {
                if(this._isVisible)
                {
                    this._isVisible = false;

                    return true;
                }

                return false;
            }

            let i = 0;

            while(i < this._secondaryNormals.length)
            {
                cosAngle = Vector3d.cosAngle(geometry.directionAxis, this._secondaryNormals[i]);

                if(cosAngle > -0.001)
                {
                    if(this._isVisible)
                    {
                        this._isVisible = false;
                        return true;
                    }

                    return false;
                }

                i++;
            }

            this.updateCorners(geometry);

            const originPos = geometry.getScreenPosition(this._origin);
            const originZ = originPos.z;

            let relativeDepth = (Math.max(this._cornerA.z, this._cornerB.z, this._cornerC.z, this._cornerD.z) - originZ);

            if(this._type === RoomPlane.TYPE_FLOOR)
            {
                relativeDepth = (relativeDepth - ((this._location.z + Math.min(0, this._leftSide.z, this._rightSide.z)) * 8));
            }

            if(this._type === RoomPlane.TYPE_LANDSCAPE)
            {
                relativeDepth = (relativeDepth + 0.02);
            }

            this._relativeDepth = relativeDepth;
            this._isVisible = true;
            this._geometryUpdateId = geometry.updateId;
        }

        if(geometryChanged || this.needsNewTexture(geometry, timeSinceStartMs))
        {
            Randomizer.setSeed(this._randomSeed);

            const width = (this._leftSide.length * geometry.scale);
            const height = (this._rightSide.length * geometry.scale);
            const normal = geometry.getCoordinatePosition(this._normal);

            this.updatePlane(geometry, timeSinceStartMs, width, height, normal);
            this.updateMask(geometry, width, height, normal);

            const planeTexture = TextureUtils.createAndWriteRenderTexture(this._width, this._height, this._planeContainer, this.getMatrixForDimensions(width, height)) as Texture;
            const planeSprite = new Sprite(planeTexture);
            let maskSprite: Sprite = null;

            if(this._maskTexture)
            {
                const maskTexture = TextureUtils.createAndWriteRenderTexture(width, height, new Sprite(this._maskTexture), this.getMatrixForDimensions(width, height)) as Texture;
                maskSprite = new Sprite(maskTexture);

                (async () =>
                {
                    console.log(`<img src='${ await TextureUtils.generateImageUrl(maskSprite) }' />`);
                })();
            }

            const container = new Container();

            container.addChild(planeSprite);

            this._planeTexture = TextureUtils.createAndWriteRenderTexture(this._width, this._height, container) as Texture;

            return true;
        }

        return false;
    }

    private updateCorners(geometry: IRoomGeometry): void
    {
        this._cornerA.assign(geometry.getScreenPosition(this._location));
        this._cornerB.assign(geometry.getScreenPosition(Vector3d.sum(this._location, this._rightSide)));
        this._cornerC.assign(geometry.getScreenPosition(Vector3d.sum(Vector3d.sum(this._location, this._leftSide), this._rightSide)));
        this._cornerD.assign(geometry.getScreenPosition(Vector3d.sum(this._location, this._leftSide)));
        this._offset = geometry.getScreenPoint(this._origin);
        this._cornerA.x = Math.round(this._cornerA.x);
        this._cornerA.y = Math.round(this._cornerA.y);
        this._cornerB.x = Math.round(this._cornerB.x);
        this._cornerB.y = Math.round(this._cornerB.y);
        this._cornerC.x = Math.round(this._cornerC.x);
        this._cornerC.y = Math.round(this._cornerC.y);
        this._cornerD.x = Math.round(this._cornerD.x);
        this._cornerD.y = Math.round(this._cornerD.y);
        this._offset.x = Math.round(this._offset.x);
        this._offset.y = Math.round(this._offset.y);

        const minX = Math.min(this._cornerA.x, this._cornerB.x, this._cornerC.x, this._cornerD.x);
        const maxX = Math.max(this._cornerA.x, this._cornerB.x, this._cornerC.x, this._cornerD.x) - minX;
        const minY = Math.min(this._cornerA.y, this._cornerB.y, this._cornerC.y, this._cornerD.y);
        const maxY = Math.max(this._cornerA.y, this._cornerB.y, this._cornerC.y, this._cornerD.y) - minY;

        this._offset.x = (this._offset.x - minX);
        this._cornerA.x = (this._cornerA.x - minX);
        this._cornerB.x = (this._cornerB.x - minX);
        this._cornerC.x = (this._cornerC.x - minX);
        this._cornerD.x = (this._cornerD.x - minX);

        this._offset.y = (this._offset.y - minY);
        this._cornerA.y = (this._cornerA.y - minY);
        this._cornerB.y = (this._cornerB.y - minY);
        this._cornerC.y = (this._cornerC.y - minY);
        this._cornerD.y = (this._cornerD.y - minY);

        this._width = maxX;
        this._height = maxY;
    }

    private getMatrixForDimensions(width: number, height: number): Matrix
    {
        let a: number = (this._cornerD.x - this._cornerC.x);
        let b: number = (this._cornerD.y - this._cornerC.y);
        let c: number = (this._cornerB.x - this._cornerC.x);
        let d: number = (this._cornerB.y - this._cornerC.y);

        if((this._type === RoomPlane.TYPE_WALL) || (this._type === RoomPlane.TYPE_LANDSCAPE))
        {
            if(Math.abs((c - width)) <= 1) c = width;

            if(Math.abs((d - width)) <= 1) d = width;

            if(Math.abs((a - height)) <= 1) a = height;

            if(Math.abs((b - height)) <= 1) b = height;
        }

        const xScale: number = (c / width);
        const ySkew: number = (d / width);
        const xSkew: number = (a / height);
        const yScale: number = (b / height);

        const matrix = new Matrix(xScale, ySkew, xSkew, yScale);

        matrix.translate(this._cornerC.x, this._cornerC.y);

        return matrix;
    }

    public resetBitmapMasks(): void
    {
        if(this._disposed || !this._useMask || !this._bitmapMasks.length) return;

        this._maskChanged = true;
        this._bitmapMasks = [];
    }

    public addBitmapMask(maskType: string, leftSideLoc: number, rightSideLoc: number): boolean
    {
        if(!this._useMask) return false;

        for(const mask of this._bitmapMasks)
        {
            if(!mask) continue;

            if((mask.type === maskType) && (mask.leftSideLoc === leftSideLoc) && (mask.rightSideLoc === rightSideLoc)) return false;
        }

        this._bitmapMasks.push(new RoomPlaneBitmapMask(maskType, leftSideLoc, rightSideLoc));
        this._maskChanged = true;

        return true;
    }

    public addRectangleMask(leftSide: number, rightSide: number, leftSideLength: number, rightSideLength: number): boolean
    {
        if(!this._useMask) return false;

        for(const mask of this._rectangleMasks)
        {
            if(!mask) continue;

            if((((mask.leftSideLoc === leftSide) && (mask.rightSideLoc === rightSide)) && (mask.leftSideLength === leftSideLength)) && (mask.rightSideLength === rightSideLength)) return false;
        }

        this._rectangleMasks.push(new RoomPlaneRectangleMask(leftSide, rightSide, leftSideLength, rightSideLength));
        this._maskChanged = true;

        return true;
    }

    private updateMask(geometry: IRoomGeometry, width: number, height: number, normal: IVector3D): void
    {
        if(!geometry || !this._useMask || (!this._bitmapMasks.length && !this._rectangleMasks.length) || !this._maskChanged || !this._maskManager) return;

        if(!this._maskTexture) this._maskTexture = TextureUtils.createTexture(width, height) as Texture;

        TextureUtils.clearTexture(this._maskTexture);

        this._bitmapMasksOld = [];
        this._rectangleMasksOld = [];

        this._bitmapMasks.forEach(mask =>
        {
            const type = mask.type;
            const posX = (width - ((width * mask.leftSideLoc) / this._leftSide.length));
            const posY = (height - ((height * mask.rightSideLoc) / this._rightSide.length));

            this._maskManager.updateMask(this._maskTexture, type, geometry.scale, normal, posX, posY);
            this._bitmapMasksOld.push(new RoomPlaneBitmapMask(type, mask.leftSideLoc, mask.rightSideLoc));
        });

        this._rectangleMasks.forEach(mask =>
        {
            const posX = (width - ((width * mask.leftSideLoc) / this._leftSide.length));
            const posY = (height - ((height * mask.rightSideLoc) / this._rightSide.length));
            const wd = ((width * mask.leftSideLength) / this._leftSide.length);
            const ht = ((height * mask.rightSideLength) / this._rightSide.length);

            const sprite = new Sprite(Texture.WHITE);

            sprite.tint = 0x000000;
            sprite.width = wd;
            sprite.height = ht;
            sprite.position.set((posX - wd), (posY - ht));

            TextureUtils.writeToTexture(sprite, this._maskTexture, false);

            this._rectangleMasksOld.push(new RoomPlaneRectangleMask(mask.leftSideLength, mask.rightSideLoc, mask.leftSideLength, mask.rightSideLength));
        });

        this._maskChanged = false;
    }

    public get planeContainer(): Container
    {
        return this._planeContainer;
    }

    public get canBeVisible(): boolean
    {
        return this._canBeVisible;
    }

    public set canBeVisible(flag: boolean)
    {
        if(flag !== this._canBeVisible) this._canBeVisible = flag;
    }

    public get visible(): boolean
    {
        return (this._isVisible && this._canBeVisible);
    }

    public get offset(): Point
    {
        return this._offset;
    }

    public get relativeDepth(): number
    {
        return this._relativeDepth;
    }

    public get color(): number
    {
        return this._color;
    }

    public set color(k: number)
    {
        this._color = k;
    }

    public get type(): number
    {
        return this._type;
    }

    public get leftSide(): IVector3D
    {
        return this._leftSide;
    }

    public get rightSide(): IVector3D
    {
        return this._rightSide;
    }

    public get location(): IVector3D
    {
        return this._location;
    }

    public get normal(): IVector3D
    {
        return this._normal;
    }

    public get hasTexture(): boolean
    {
        return this._hasTexture;
    }

    public set hasTexture(k: boolean)
    {
        this._hasTexture = k;
    }

    public set maskManager(manager: PlaneMaskManager)
    {
        this._maskManager = manager;
    }

    public set id(k: string)
    {
        if(k === this._id) return;

        this._id = k;
    }

    public get uniqueId(): number
    {
        return this._uniqueId;
    }

    public get planeTexture(): Texture
    {
        return this._planeTexture;
    }
}
