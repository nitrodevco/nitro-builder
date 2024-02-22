import { Container } from 'pixi.js';
import { IAssetPlaneVisualization, IAssetPlaneVisualizationData, IAssetPlaneVisualizationLayer, IGraphicAssetCollection, IPlaneRasterizer, IRoomGeometry, IVector3D, Vector3d } from '../../../../../../../api';
import { RoomGeometry } from '../../../../../utils';
import { FloorPlane } from './FloorPlane';
import { Plane } from './Plane';

export class PlaneRasterizer implements IPlaneRasterizer
{
    protected static DEFAULT: string = 'default';

    private _assetCollection: IGraphicAssetCollection;
    private _planes: Map<string, Plane>;
    private _geometries: Map<string, RoomGeometry>;
    private _data: IAssetPlaneVisualizationData;

    constructor()
    {
        this._assetCollection = null;
        this._planes = new Map();
        this._geometries = new Map();
        this._data = null;
    }

    protected get data(): IAssetPlaneVisualizationData
    {
        return this._data;
    }

    protected get assetCollection(): IGraphicAssetCollection
    {
        return this._assetCollection;
    }

    public initializeDimensions(k: number, _arg_2: number): boolean
    {
        return true;
    }

    public initialize(data: IAssetPlaneVisualizationData): void
    {
        this._data = data;
    }

    protected getPlane(planeId: string): Plane
    {
        return this._planes.get(planeId);
    }

    protected addPlane(id: string, plane: Plane): boolean
    {
        if(!plane) return false;

        const existing = this._planes.get(id);

        if(!existing)
        {
            this._planes.set(id, plane);

            return true;
        }

        return false;
    }

    protected getGeometry(size: number, horizontalAngle: number, verticalAngle: number): IRoomGeometry
    {
        horizontalAngle = Math.abs(horizontalAngle);
        if(horizontalAngle > 90) horizontalAngle = 90;

        verticalAngle = Math.abs(verticalAngle);
        if(verticalAngle > 90) verticalAngle = 90;

        const identifier = `${ size }_${ Math.round(horizontalAngle) }_${ Math.round(verticalAngle) }`;

        let geometry = this._geometries.get(identifier);

        if(geometry) return geometry;

        geometry = new RoomGeometry(size, new Vector3d(horizontalAngle, verticalAngle), new Vector3d(-10, 0, 0));

        this._geometries.set(identifier, geometry);

        return geometry;
    }

    protected parseVisualizations(plane: Plane, visualizations: IAssetPlaneVisualization[]): void
    {
        if(!plane || !visualizations) return;

        if(visualizations && visualizations.length)
        {
            for(const visualization of visualizations)
            {
                if(!visualization) continue;

                const size = visualization.size;

                let horizontalAngle = FloorPlane.HORIZONTAL_ANGLE_DEFAULT;
                let verticalAngle = FloorPlane.VERTICAL_ANGLE_DEFAULT;

                if(visualization.horizontalAngle !== undefined) horizontalAngle = visualization.horizontalAngle;
                if(visualization.verticalAngle !== undefined) verticalAngle = visualization.verticalAngle;

                const layers = visualization.allLayers as IAssetPlaneVisualizationLayer[];

                plane.createPlaneVisualization(size, ((layers && layers.length) || 0), this.getGeometry(size, horizontalAngle, verticalAngle));
            }
        }
    }

    public render(planeId: string, container: Container, id: string, width: number, height: number, size: number, normal: IVector3D, useTexture: boolean, offsetX: number = 0, offsetY: number = 0, maxX: number = 0, maxY: number = 0, timeSinceStartMs: number = 0): void
    {
        return null;
    }

    public getTextureIdentifier(k: number, normal: IVector3D): string
    {
        return k.toString();
    }
}
