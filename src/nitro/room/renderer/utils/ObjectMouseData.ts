export class ObjectMouseData
{
    private _objectId: string = '';
    private _spriteTag: string = '';

    public get objectId(): string
    {
        return this._objectId;
    }

    public set objectId(id: string)
    {
        this._objectId = id;
    }

    public get spriteTag(): string
    {
        return this._spriteTag;
    }

    public set spriteTag(tag: string)
    {
        this._spriteTag = tag;
    }
}
