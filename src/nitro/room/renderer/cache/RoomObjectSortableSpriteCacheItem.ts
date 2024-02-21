import { SortableSprite } from '../utils';

export class RoomObjectSortableSpriteCacheItem
{
    private _sprites: SortableSprite[];
    private _updateId1: number;
    private _updateId2: number;
    private _isEmpty: boolean;

    constructor()
    {
        this._sprites = [];
        this._updateId1 = -1;
        this._updateId2 = -1;
        this._isEmpty = false;
    }

    public get spriteCount(): number
    {
        return this._sprites.length;
    }

    public get isEmpty(): boolean
    {
        return this._isEmpty;
    }

    public dispose(): void
    {
        this.setSpriteCount(0);
    }

    public addSprite(sprite: SortableSprite): void
    {
        this._sprites.push(sprite);
    }

    public getSprite(k: number): SortableSprite
    {
        return this._sprites[k];
    }

    public get sprites(): SortableSprite[]
    {
        return this._sprites;
    }

    public needsUpdate(a: number, b: number): boolean
    {
        if((a === this._updateId1) && (b === this._updateId2)) return false;

        this._updateId1 = a;
        this._updateId2 = b;

        return true;
    }

    public setSpriteCount(count: number): void
    {
        if(count < this._sprites.length)
        {
            let iterator = count;

            while(iterator < this._sprites.length)
            {
                const sprite = this._sprites[iterator];

                if(sprite) sprite.dispose();

                iterator++;
            }

            this._sprites.splice(count, (this._sprites.length - count));
        }

        this._isEmpty = (this._sprites.length) ? false : true;
    }
}
