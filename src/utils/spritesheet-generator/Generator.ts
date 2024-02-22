import { Sprite, Texture } from 'pixi.js';
import { Base64ToArrayBuffer, ISpritesheetData, TextureUtils } from '../../api';

export const CreateSpritesheet = async (textures: Texture[]) =>
{
    if(!textures) textures = [];
    const columns = 1;

    let xOffset = 0;
    let yOffset = 0;
    let currentColumn = 1;
    let tallestSpriteInRowHeight = 0;
    let spriteWidth = 0;
    let spriteHeight = 0;

    const spritePlacements = textures.map(texture =>
    {
        const dimensions: { width: number, height: number } = { width: texture.width, height: texture.height };
        const x = xOffset;
        const y = yOffset;
        
        if(dimensions.height > tallestSpriteInRowHeight) tallestSpriteInRowHeight = dimensions.height;

        currentColumn++;

        if(currentColumn > columns)
        {
            currentColumn = 1;

            yOffset += tallestSpriteInRowHeight;
            tallestSpriteInRowHeight = 0;

            xOffset = 0;
        }
        else
        {
            xOffset += dimensions.width;
        }

        if(spriteWidth < dimensions.width) spriteWidth = dimensions.width;
        spriteHeight += dimensions.height;

        return {
            texture,
            x,
            y,
            width: dimensions.width,
            height: dimensions.height,
        };
    });

    const renderTexture = TextureUtils.createTexture(spriteWidth, spriteHeight);

    spritePlacements.forEach(sprite =>
    {
        const newSprite = new Sprite(sprite.texture);

        newSprite.x = sprite.x;
        newSprite.y = sprite.y;

        TextureUtils.writeToTexture(newSprite, renderTexture, false);
    });

    (async () =>
    {
        TextureUtils.generateImage
        console.log(await TextureUtils.generateImageUrl(renderTexture));
    })();

    const jsonData: ISpritesheetData = {
        meta: {
            app: 'nitro-builder',
            version: '1.0.0',
            image: `${ 'name' }.png`,
            format: 'RGBA8888',
            size: {
                w: spriteWidth,
                h: spriteHeight,
            },
            scale: '1',
        },
        frames: {}
    };

    spritePlacements.forEach(sprite =>
    {
        jsonData.frames[sprite.texture.label] = {
            frame: {
                x: sprite.x,
                y: sprite.y,
                w: sprite.width,
                h: sprite.height,
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: sprite.width,
                h: sprite.height,
            },
            sourceSize: {
                w: sprite.width,
                h: sprite.height,
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
