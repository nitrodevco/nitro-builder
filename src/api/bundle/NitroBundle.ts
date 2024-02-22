import ByteBuffer from 'bytebuffer';
import { deflate, inflate } from 'pako';
import { Assets, Texture } from 'pixi.js';
import { IAssetData } from '../asset';
import { ArrayBufferToBase64, BinaryReader } from '../utils';

export class NitroBundle
{
    public static TEXT_DECODER: TextDecoder = new TextDecoder('utf-8');
    public static TEXT_ENCODER: TextEncoder = new TextEncoder();

    private _files: Map<string, ArrayBuffer> = new Map();

    private _file: IAssetData = null;
    private _texture: Texture = null;

    public static async from(buffer: ArrayBuffer): Promise<NitroBundle>
    {
        const bundle = new NitroBundle();

        await bundle.parse(buffer);

        return bundle;
    }

    public addFile(name: string, data: ArrayBuffer): void
    {
        this._files.set(name, data);
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
            const inflatedBuffer = inflate(buffer.toArrayBuffer());

            this._files.set(fileName, inflatedBuffer);

            if(fileName.endsWith('.json'))
            {
                this._file = JSON.parse(NitroBundle.TEXT_DECODER.decode(inflatedBuffer));
            }

            if(fileName.endsWith('.png'))
            {
                this._texture = await Assets.load<Texture>(`data:image/png;base64,${ ArrayBufferToBase64(inflatedBuffer) }`);
            }

            fileCount--;
        }
    }

    public toBuffer(): ArrayBuffer
    {
        const buffer = new ByteBuffer();

        buffer.writeUint16(this._files.size);

        for(const file of this._files.entries())
        {
            const fileName = file[0];
            const fileBuffer = file[1];

            buffer.writeUint16(fileName.length);
            buffer.writeString(fileName);

            const compressed = deflate(fileBuffer);
            buffer.writeUint32(compressed.length);
            buffer.append(compressed);
        }

        buffer.flip();

        return buffer.toBuffer();
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
