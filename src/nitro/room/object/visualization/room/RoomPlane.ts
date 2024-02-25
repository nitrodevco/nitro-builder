import { Container, Matrix, Point, Texture, TilingSprite } from 'pixi.js';
import { GetAssetManager, IRoomGeometry, IRoomPlane, IVector3D, TextureUtils, Vector3d } from '../../../../../api';
import { Randomizer } from './Randomizer';

export class RoomPlane implements IRoomPlane
{
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
    private _type: number;
    private _isVisible: boolean;
    private _offset: Point;
    private _relativeDepth: number;
    private _color: number;
    private _id: string;
    private _uniqueId: number;
    private _cornerA: Vector3d;
    private _cornerB: Vector3d;
    private _cornerC: Vector3d;
    private _cornerD: Vector3d;
    private _width: number = 0;
    private _height: number = 0;
    private _canBeVisible: boolean;

    private _tilingSprite: TilingSprite = null;
    private _planeTexture: Texture = null;

    constructor(origin: IVector3D, location: IVector3D, leftSide: IVector3D, rightSide: IVector3D, type: number, usesMask: boolean, secondaryNormals: IVector3D[], randomSeed: number, textureOffsetX: number = 0, textureOffsetY: number = 0, textureMaxX: number = 0, textureMaxY: number = 0)
    {
        this._secondaryNormals = [];
        this._randomSeed = randomSeed;
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

        this._disposed = true;
    }

    public update(geometry: IRoomGeometry, timeSinceStartMs: number): boolean
    {
        if(!geometry || this._disposed) return false;

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

        let relativeDepth = (Math.max(this._cornerA.z, this._cornerB.z, this._cornerC.z, this._cornerD.z) - geometry.getScreenPosition(this._origin).z);

        switch(this._type)
        {
            case RoomPlane.TYPE_FLOOR:
                relativeDepth = (relativeDepth - ((this._location.z + Math.min(0, this._leftSide.z, this._rightSide.z)) * 8));
                break;
            case RoomPlane.TYPE_LANDSCAPE:
                relativeDepth = (relativeDepth + 0.02);
                break;
        }

        this._relativeDepth = relativeDepth;
        this._isVisible = true;

        Randomizer.setSeed(this._randomSeed);

        const width = (this._leftSide.length * geometry.scale);
        const height = (this._rightSide.length * geometry.scale);
        const normal = geometry.getCoordinatePosition(this._normal);

        const planeContainer = new Container();

        let planeSprite: Container = null;

        switch(this._type)
        {
            case RoomPlane.TYPE_FLOOR: {
                planeSprite = new TilingSprite({
                    texture: GetAssetManager().getTexture('floor_texture'),
                    width: width,
                    height: height,
                    applyAnchorToTexture: true
                });

                planeSprite.tint = window.NitroBuilderConfig['floor.color'];
                break;
            }
            case RoomPlane.TYPE_WALL: {
                planeSprite = new TilingSprite({
                    texture: Texture.WHITE,
                    width: width,
                    height: height,
                    applyAnchorToTexture: true
                });

                planeSprite.tint = window.NitroBuilderConfig['wall.color'];
                break;
            }
            default: {
                planeSprite = new TilingSprite({
                    texture: Texture.WHITE,
                    width: width,
                    height: height,
                    applyAnchorToTexture: true
                });
            }
        }

        if(planeSprite) planeContainer.addChild(planeSprite);

        this._planeTexture = TextureUtils.createAndWriteRenderTexture(this._width, this._height, planeContainer, this.getMatrixForDimensions(width, height)) as Texture;

        return true;
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
