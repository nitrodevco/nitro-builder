import { IAssetAnimationAdd } from './IAssetAnimationAdd';

export class AssetAnimationAdd
{
    public id: string;
    public align: string;
    public blend: string;
    public ink: number;
    public base: string;

    public static from(data: IAssetAnimationAdd): AssetAnimationAdd
    {
        const animationAdd = new AssetAnimationAdd();

        if(data.id != undefined) animationAdd.id = data.id;
        if(data.align != undefined) animationAdd.align = data.align;
        if(data.blend != undefined) animationAdd.blend = data.blend;
        if(data.ink != undefined) animationAdd.ink = data.ink;
        if(data.base != undefined) animationAdd.base = data.base;

        return animationAdd;
    }

    public toJSON(): IAssetAnimationAdd
    {
        const json: IAssetAnimationAdd = {};

        if(this.id != undefined) json.id = this.id;
        if(this.align != undefined) json.align = this.align;
        if(this.blend != undefined) json.blend = this.blend;
        if(this.ink != undefined) json.ink = this.ink;
        if(this.base != undefined) json.base = this.base;

        return json;
    }
}
