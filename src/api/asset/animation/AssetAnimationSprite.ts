import { AssetAnimationSpriteDirection } from './AssetAnimationSpriteDirection';
import { IAssetAnimationSprite } from './IAssetAnimationSprite';
import { IAssetAnimationSpriteDirection } from './IAssetAnimationSpriteDirection';

export class AssetAnimationSprite
{
    public id: string;
    public member: string;
    public directions: number;
    public staticY: number;
    public ink: number;
    public directionList?: IAssetAnimationSpriteDirection[];

    public static from(data: IAssetAnimationSprite): AssetAnimationSprite
    {
        const assetSprite = new AssetAnimationSprite();

        if(data.id != undefined) assetSprite.id = data.id;
        if(data.member != undefined) assetSprite.member = data.member;
        if(data.directions != undefined) assetSprite.directions = data.directions;
        if(data.staticY != undefined) assetSprite.staticY = data.staticY;
        if(data.ink != undefined) assetSprite.ink = data.ink;

        if(data.directionList != undefined)
        {
            const directionList: IAssetAnimationSpriteDirection[] = [];

            if(Array.isArray(data.directionList) && data.directionList.length)
            {
                for(const spriteDirectionData of data.directionList)
                {
                    const spriteDirection = AssetAnimationSpriteDirection.from(spriteDirectionData);

                    if(spriteDirection) directionList.push(spriteDirection);
                }
            }

            if(directionList.length) assetSprite.directionList = directionList;
        }

        return assetSprite;
    }

    public toJSON(): IAssetAnimationSprite
    {
        const json: IAssetAnimationSprite = {};

        if(this.id != undefined) json.id = this.id;
        if(this.member != undefined) json.member = this.member;
        if(this.directions != undefined) json.directions = this.directions;
        if(this.staticY != undefined) json.staticY = this.staticY;
        if(this.ink != undefined) json.ink = this.ink;
        if(this.directionList != undefined) json.directionList = this.directionList;

        return json;
    }
}
