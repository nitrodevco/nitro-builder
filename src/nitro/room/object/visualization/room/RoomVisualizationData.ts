import { IAssetData, IGraphicAssetCollection, IObjectVisualizationData } from '../../../../../api';

export class RoomVisualizationData implements IObjectVisualizationData
{
    private _initialized: boolean = false;

    public initialize(asset: IAssetData): boolean
    {
        return true;
    }

    public dispose(): void
    {
    }

    public setGraphicAssetCollection(collection: IGraphicAssetCollection): void
    {
        if(this._initialized) return;

        this._initialized = true;
    }
}
