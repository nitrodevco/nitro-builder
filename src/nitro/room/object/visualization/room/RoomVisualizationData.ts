import { IAssetData, IGraphicAssetCollection, IObjectVisualizationData } from '../../../../../api';
import { PlaneMaskManager } from './mask';
import { FloorRasterizer, WallRasterizer } from './rasterizer';

export class RoomVisualizationData implements IObjectVisualizationData
{
    private _wallRasterizer: WallRasterizer = new WallRasterizer();
    private _floorRasterizer: FloorRasterizer = new FloorRasterizer();
    private _maskManager: PlaneMaskManager = new PlaneMaskManager();
    private _initialized: boolean = false;

    public initialize(asset: IAssetData): boolean
    {
        if(!asset.roomVisualization) return false;

        const wallData = asset.roomVisualization.wallData;

        if(wallData) this._wallRasterizer.initialize(wallData);

        const floorData = asset.roomVisualization.floorData;

        if(floorData) this._floorRasterizer.initialize(floorData);

        const maskData = asset.roomVisualization.maskData;

        if(maskData) this._maskManager.initialize(maskData);

        return true;
    }

    public dispose(): void
    {
        if(this._maskManager)
        {
            this._maskManager.dispose();

            this._maskManager = null;
        }
    }

    public setGraphicAssetCollection(collection: IGraphicAssetCollection): void
    {
        if(this._initialized) return;

        this._initialized = true;
    }

    public get wallRasterizer(): WallRasterizer
    {
        return this._wallRasterizer;
    }

    public get floorRasterizer(): FloorRasterizer
    {
        return this._floorRasterizer;
    }

    public get maskManager(): PlaneMaskManager
    {
        return this._maskManager;
    }
}
