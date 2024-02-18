import { inflate } from 'pako';
import { Assets, Texture } from 'pixi.js';
import { IAssetData } from '../asset';
import { ArrayBufferToBase64, BinaryReader } from '../utils';

export class NitroBundle
{
    private static TEXT_DECODER: TextDecoder = new TextDecoder('utf-8');

    private _file: IAssetData = null;
    private _texture: Texture = null;

    public static async from(buffer: ArrayBuffer): Promise<NitroBundle>
    {
        const bundle = new NitroBundle();

        await bundle.parse(buffer);

        return bundle;
    }

    private async parse(buffer: ArrayBuffer): Promise<void>
    {
        const binaryReader = new BinaryReader(buffer);

        let fileCount = binaryReader.readShort();

        while(fileCount > 0)
        {
            const fileNameLength = binaryReader.readShort();
            const fileName = binaryReader.readBytes(fileNameLength).toString();
            const fileLength = binaryReader.readInt();
            const buffer = binaryReader.readBytes(fileLength);

            if(fileName.endsWith('.json'))
            {
                this._file = JSON.parse(NitroBundle.TEXT_DECODER.decode(inflate(buffer.toArrayBuffer())));
            }

            if(fileName.endsWith('.png'))
            {
                this._texture = await Assets.load<Texture>(`data:image/png;base64,${ ArrayBufferToBase64(inflate(buffer.toArrayBuffer())) }`);
            }

            fileCount--;
        }
    }

    public get file(): IAssetData
    {
        return this._file;
    }

    public get texture(): Texture
    {
        return this._texture;
    }
}
