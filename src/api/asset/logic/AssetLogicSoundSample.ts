import { IAssetLogicSoundSample } from './IAssetLogicSoundSample';

export class AssetLogicSoundSample
{
    public id: number;
    public noPitch: boolean;

    public static from(data: IAssetLogicSoundSample): AssetLogicSoundSample
    {
        const soundSample = new AssetLogicSoundSample();

        if(data.id != undefined) soundSample.id = data.id;
        if(data.noPitch != undefined) soundSample.noPitch = data.noPitch;

        return soundSample;
    }

    public toJSON(): IAssetLogicSoundSample
    {
        const json: IAssetLogicSoundSample = {};

        if(this.id != undefined) json.id = this.id;
        if(this.noPitch != undefined) json.noPitch = this.noPitch;

        return json;
    }
}
