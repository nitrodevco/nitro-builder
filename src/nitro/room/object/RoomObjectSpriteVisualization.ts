import { Container, Point, Rectangle, Sprite, Texture } from 'pixi.js';
import { IGraphicAssetCollection, IObjectVisualizationData, IRoomGeometry, IRoomObjectController, IRoomObjectSprite, IRoomObjectSpriteVisualization, TextureUtils } from '../../../api';
import { RoomObjectSprite } from './RoomObjectSprite';

export class RoomObjectSpriteVisualization implements IRoomObjectSpriteVisualization
{
    private static VISUALIZATION_COUNTER: number = 0;

    private _id: number;
    private _object: IRoomObjectController;
    private _asset: IGraphicAssetCollection;
    private _sprites: IRoomObjectSprite[];

    protected _scale: number;

    private _updateObjectCounter: number;
    private _updateModelCounter: number;
    private _updateSpriteCounter: number;

    constructor()
    {
        this._id = RoomObjectSpriteVisualization.VISUALIZATION_COUNTER++;
        this._object = null;
        this._asset = null;
        this._sprites = [];

        this._scale = -1;

        this._updateObjectCounter = -1;
        this._updateModelCounter = -1;
        this._updateSpriteCounter = -1;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        return false;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        return;
    }

    protected reset(): void
    {
        this._scale = -1;
    }

    public dispose(): void
    {
        if(this._sprites)
        {
            while(this._sprites.length)
            {
                const sprite = (this._sprites[0] as RoomObjectSprite);

                if(sprite) sprite.dispose();

                this._sprites.pop();
            }

            this._sprites = null;
        }

        this._object = null;
        this._asset = null;
    }

    public getSprite(index: number): IRoomObjectSprite
    {
        if((index >= 0) && (index < this._sprites.length)) return this._sprites[index];

        return null;
    }

    public createSprite(): IRoomObjectSprite
    {
        return this.createSpriteAtIndex(this._sprites.length);
    }

    public createSpriteAtIndex(index: number): IRoomObjectSprite
    {
        const sprite = new RoomObjectSprite();

        if(index >= this._sprites.length)
        {
            this._sprites.push(sprite);
        }
        else
        {
            this._sprites.splice(index, 0, sprite);
        }

        return sprite;
    }

    protected createSprites(count: number): void
    {
        while(this._sprites.length > count)
        {
            const sprite = this._sprites[(this._sprites.length - 1)] as RoomObjectSprite;

            if(sprite) sprite.dispose();

            this._sprites.pop();
        }

        while(this._sprites.length < count)
        {
            this._sprites.push(new RoomObjectSprite());
        }
    }

    public getObjectAsTexture(): Texture
    {
        const boundingRectangle = this.getBoundingRectangle();

        if((boundingRectangle.width * boundingRectangle.height) === 0) return null;

        const spriteList: IRoomObjectSprite[] = [];

        for(const sprite of this._sprites) sprite && sprite.visible && sprite.texture && spriteList.push(sprite);

        spriteList.sort((a, b) => b.relativeDepth - a.relativeDepth);

        const container = new Container();

        for(const objectSprite of spriteList)
        {
            const texture = objectSprite.texture;

            if(!texture) continue;

            const sprite = new Sprite(texture);

            sprite.alpha = (objectSprite.alpha / 255);
            sprite.tint = objectSprite.color;
            sprite.x = objectSprite.offsetX;
            sprite.y = objectSprite.offsetY;
            sprite.blendMode = objectSprite.blendMode;
            sprite.filters = objectSprite.filters;

            if(objectSprite.flipH) sprite.scale.x = -1;

            if(objectSprite.flipV) sprite.scale.y = -1;

            container.addChild(sprite);
        }

        return TextureUtils.generateTexture(container);
    }

    public getBoundingRectangle(): Rectangle
    {
        const totalSprites = this.totalSprites;
        const rectangle = new Rectangle();

        let iterator = 0;

        while(iterator < totalSprites)
        {
            const sprite = this.getSprite(iterator);

            if(sprite && sprite.texture && sprite.visible)
            {
                const offsetX = ((sprite.flipH) ? (-(sprite.width) + sprite.offsetX) : sprite.offsetX);
                const offsetY = ((sprite.flipV) ? (-(sprite.height) + sprite.offsetY) : sprite.offsetY);

                const point = new Point(offsetX, offsetY);

                if(iterator === 0)
                {
                    rectangle.x = point.x;
                    rectangle.y = point.y;
                    rectangle.width = sprite.width;
                    rectangle.height = sprite.height;
                }
                else
                {
                    if(point.x < rectangle.x) rectangle.x = point.x;

                    if(point.y < rectangle.y) rectangle.y = point.y;

                    if((point.x + sprite.width) > rectangle.right) rectangle.width = ((point.x + sprite.width) - rectangle.x);

                    if((point.y + sprite.height) > rectangle.bottom) rectangle.height = ((point.y + sprite.height) - rectangle.y);
                }
            }

            iterator++;
        }

        return rectangle;
    }

    public get instanceId(): number
    {
        return this._id;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public set object(object: IRoomObjectController)
    {
        this._object = object;
    }

    public get asset(): IGraphicAssetCollection
    {
        return this._asset;
    }

    public set asset(asset: IGraphicAssetCollection)
    {
        this._asset = asset;
    }

    public get sprites(): IRoomObjectSprite[]
    {
        return this._sprites;
    }

    public get totalSprites(): number
    {
        return this._sprites.length;
    }

    public get updateObjectCounter(): number
    {
        return this._updateObjectCounter;
    }

    public set updateObjectCounter(count: number)
    {
        this._updateObjectCounter = count;
    }

    public get updateModelCounter(): number
    {
        return this._updateModelCounter;
    }

    public set updateModelCounter(count: number)
    {
        this._updateModelCounter = count;
    }

    public get updateSpriteCounter(): number
    {
        return this._updateSpriteCounter;
    }

    public set updateSpriteCounter(count: number)
    {
        this._updateSpriteCounter = count;
    }

    public get spriteCount(): number
    {
        return this._sprites.length;
    }
}
