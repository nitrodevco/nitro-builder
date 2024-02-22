import { Sprite, Texture } from 'pixi.js';
import { Base64ToArrayBuffer, ISpritesheetData, TextureUtils } from '../api';

export const CreateSpritesheet = async (name: string, textures: Texture[]) =>
{
    if(!textures || !textures.length) return null;

    let spritesheetWidth = 0;
    let spritesheetHeight = 0;

    const sprites = textures.map(texture =>
    {
        const width = texture.width;
        const height = texture.height;

        if(spritesheetWidth < width) spritesheetWidth = width;

        spritesheetHeight += height;

        return {
            texture,
            position: { x: 0, y: (spritesheetHeight - height) },
            dimensions: { width, height }
        };
    });

    const renderTexture = TextureUtils.createTexture(spritesheetWidth, spritesheetHeight);

    sprites.forEach(sprite =>
    {
        const newSprite = new Sprite(sprite.texture);

        newSprite.position.set(sprite.position.x, sprite.position.y);

        TextureUtils.writeToTexture(newSprite, renderTexture, false);
    });

    const jsonData: ISpritesheetData = {
        meta: {
            app: 'nitro-builder',
            version: '1.0.0',
            image: `${ name }.png`,
            format: 'RGBA8888',
            size: {
                w: spritesheetWidth,
                h: spritesheetHeight,
            },
            scale: '1',
        },
        frames: {}
    };

    sprites.forEach(sprite =>
    {
        jsonData.frames[sprite.texture.label] = {
            frame: {
                x: sprite.position.x,
                y: sprite.position.y,
                w: sprite.dimensions.width,
                h: sprite.dimensions.height,
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: sprite.dimensions.width,
                h: sprite.dimensions.height,
            },
            sourceSize: {
                w: sprite.dimensions.width,
                h: sprite.dimensions.height,
            },
            pivot: {
                x: 0.5,
                y: 0.5,
            }
        }
    });

    const url = await TextureUtils.generateImageUrl(renderTexture);

    const arrayBuffer = Base64ToArrayBuffer(url.split('data:image/png;base64,')[1]);

    return {
        spritesheetData: jsonData,
        spritesheet: arrayBuffer
    }
}
