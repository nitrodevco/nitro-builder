import { IAssetAnimationAvatar } from './IAssetAnimationAvatar';

export class AssetAnimationAvatar
{
    public ink?: number;
    public foreground?: string;
    public background?: string;

    public static from(data: IAssetAnimationAvatar): AssetAnimationAvatar
    {
        const assetAvatar = new AssetAnimationAvatar();

        if(data.ink != undefined) assetAvatar.ink = data.ink;
        if(data.foreground != undefined) assetAvatar.foreground = data.foreground;
        if(data.background != undefined) assetAvatar.background = data.background;

        return assetAvatar;
    }

    public toJSON(): IAssetAnimationAvatar
    {
        const json: IAssetAnimationAvatar = {};

        if(this.ink != undefined) json.ink = this.ink;
        if(this.foreground != undefined) json.foreground = this.foreground;
        if(this.background != undefined) json.background = this.background;

        return json;
    }
}
