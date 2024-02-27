import { AssetAnimationAdd } from './AssetAnimationAdd';
import { AssetAnimationAvatar } from './AssetAnimationAvatar';
import { AssetAnimationDirection } from './AssetAnimationDirection';
import { AssetAnimationFrame } from './AssetAnimationFrame';
import { AssetAnimationOverride } from './AssetAnimationOverride';
import { AssetAnimationRemove } from './AssetAnimationRemove';
import { AssetAnimationShadow } from './AssetAnimationShadow';
import { AssetAnimationSprite } from './AssetAnimationSprite';
import { IAssetAnimation } from './IAssetAnimation';

export class AssetAnimation
{
    public key: string;

    public name: string;
    public desc: string;
    public resetOnToggle: boolean;
    public directions: AssetAnimationDirection[];
    public shadows: AssetAnimationShadow[];
    public adds: AssetAnimationAdd[];
    public removes: AssetAnimationRemove[];
    public sprites: AssetAnimationSprite[];
    public frames: AssetAnimationFrame[];
    public avatars: AssetAnimationAvatar[];
    public overrides: AssetAnimationOverride[];

    public static from(key: string, data: IAssetAnimation): AssetAnimation
    {
        const animation = new AssetAnimation();

        animation.key = key;

        if(data.name != undefined) animation.name = data.name;
        if(data.desc != undefined) animation.desc = data.desc;
        if(data.resetOnToggle != undefined) animation.resetOnToggle = data.resetOnToggle;

        if(data.directions != undefined)
        {
            const directions: AssetAnimationDirection[] = [];

            if(Array.isArray(data.directions) && data.directions.length)
            {
                for(const directionData of data.directions)
                {
                    const direction = AssetAnimationDirection.from(directionData);

                    if(direction) directions.push(direction);
                }
            }

            if(directions.length) animation.directions = directions;
        }

        if(data.shadows != undefined)
        {
            const shadows: AssetAnimationShadow[] = [];

            if(Array.isArray(data.shadows) && data.shadows.length)
            {
                for(const shadowData of data.shadows)
                {
                    const shadow = AssetAnimationShadow.from(shadowData);

                    if(shadow) shadows.push(shadow);
                }
            }

            if(shadows.length) animation.shadows = shadows;
        }

        if(data.adds != undefined)
        {
            const adds: AssetAnimationAdd[] = [];

            if(Array.isArray(data.adds) && data.adds.length)
            {
                for(const addData of data.adds)
                {
                    const add = AssetAnimationAdd.from(addData);

                    if(add) adds.push(add);
                }
            }

            if(adds.length) animation.adds = adds;
        }

        if(data.removes != undefined)
        {
            const removes: AssetAnimationRemove[] = [];

            if(Array.isArray(data.removes) && data.removes.length)
            {
                for(const removeData of data.removes)
                {
                    const remove = AssetAnimationRemove.from(removeData);

                    if(remove) removes.push(remove);
                }
            }

            if(removes.length) animation.removes = removes;
        }

        if(data.sprites != undefined)
        {
            const sprites: AssetAnimationSprite[] = [];

            if(Array.isArray(data.sprites) && data.sprites.length)
            {
                for(const spriteData of data.sprites)
                {
                    const sprite = AssetAnimationSprite.from(spriteData);

                    if(sprite) sprites.push(sprite);
                }
            }

            if(sprites.length) animation.sprites = sprites;
        }

        if(data.frames != undefined)
        {
            const frames: AssetAnimationFrame[] = [];

            if(Array.isArray(data.frames) && data.frames.length)
            {
                for(const frameData of data.frames)
                {
                    const frame = AssetAnimationFrame.from(frameData);

                    if(frame) frames.push(frame);
                }
            }

            if(frames.length) animation.frames = frames;
        }

        if(data.avatars != undefined)
        {
            const avatars: AssetAnimationAvatar[] = [];

            if(Array.isArray(data.avatars) && data.avatars.length)
            {
                for(const avatarData of data.avatars)
                {
                    const avatar = AssetAnimationAvatar.from(avatarData);

                    if(avatar) avatars.push(avatar);
                }
            }

            if(avatars.length) animation.avatars = avatars;
        }

        if(data.overrides != undefined)
        {
            const overrides: AssetAnimationOverride[] = [];

            if(Array.isArray(data.overrides) && data.overrides.length)
            {
                for(const overrideData of data.overrides)
                {
                    const override = AssetAnimationOverride.from(overrideData);

                    if(override) overrides.push(override);
                }
            }

            if(overrides.length) animation.overrides = overrides;
        }

        return animation;
    }

    public toJSON(): IAssetAnimation
    {
        const json: IAssetAnimation = {};

        if(this.name != undefined) json.name = this.name;
        if(this.desc != undefined) json.desc = this.desc;
        if(this.resetOnToggle != undefined) json.resetOnToggle = this.resetOnToggle;
        if(this.directions != undefined) json.directions = this.directions;
        if(this.shadows != undefined) json.shadows = this.shadows;
        if(this.adds != undefined) json.adds = this.adds;
        if(this.removes != undefined) json.removes = this.removes;
        if(this.sprites != undefined) json.sprites = this.sprites;
        if(this.frames != undefined) json.frames = this.frames;
        if(this.avatars != undefined) json.avatars = this.avatars;
        if(this.overrides != undefined) json.overrides = this.overrides;

        return json;
    }
}
