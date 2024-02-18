import { Container, ExtractImageOptions, ExtractOptions, ExtractSystem, GenerateTextureOptions, GetPixelsOutput, ICanvas, Matrix, RenderSurface, RenderTexture, Renderer, Sprite, Texture } from 'pixi.js';
import { GetPixi } from './GetPixi';

export class TextureUtils
{
    public static generateTexture(options: GenerateTextureOptions | Container): Texture
    {
        if(!options) return null;

        return this.getRenderer().textureGenerator.generateTexture(options);
    }

    public static async generateImage(options: ExtractImageOptions | Container | Texture): Promise<HTMLImageElement>
    {
        if(!options) return null;

        return await this.getExtractor().image(options);
    }

    public static async generateImageUrl(options: ExtractImageOptions | Container | Texture): Promise<string>
    {
        if(!options) return null;

        return await this.getExtractor().base64(options);
    }

    public static generateCanvas(options: ExtractImageOptions | Container | Texture): ICanvas
    {
        if(!options) return null;

        return this.getExtractor().canvas(options);
    }

    public static clearTexture(texture: Texture): RenderSurface
    {
        if(!texture) return null;

        return this.writeToTexture(new Sprite(Texture.EMPTY), texture);
    }

    public static createTexture(width: number, height: number): Texture
    {
        if((width < 0) || (height < 0)) return null;

        return RenderTexture.create({
            width,
            height
        });
    }

    public static createAndFillRenderTexture(width: number, height: number, color: number = 16777215): RenderSurface
    {
        if((width < 0) || (height < 0)) return null;

        const texture = this.createTexture(width, height);

        return this.clearAndFillTexture(texture, color);
    }

    public static createAndWriteRenderTexture(width: number, height: number, container: Container, transform: Matrix = null): RenderSurface
    {
        if((width < 0) || (height < 0)) return null;

        const texture = this.createTexture(width, height);

        return this.writeToTexture(container, texture, true, transform);
    }

    public static clearAndFillTexture(target: Texture, color: number = 16777215): RenderSurface
    {
        if(!target) return null;

        const sprite = new Sprite(Texture.WHITE);

        sprite.tint = color;

        sprite.width = target.width;
        sprite.height = target.height;

        return this.writeToTexture(sprite, target);
    }

    public static writeToTexture(container: Container, target: RenderSurface, clear: boolean = true, transform: Matrix = null): RenderSurface
    {
        if(!container || !target) return null;

        this.getRenderer().render({
            container,
            target,
            clear,
            transform
        });

        return target;
    }

    public static getPixels(options: ExtractOptions | Container | Texture): GetPixelsOutput
    {
        return this.getExtractor().pixels(options);
    }

    public static getRenderer(): Renderer
    {
        return GetPixi().renderer;
    }

    public static getExtractor(): ExtractSystem
    {
        return this.getRenderer().extract;
    }
}
