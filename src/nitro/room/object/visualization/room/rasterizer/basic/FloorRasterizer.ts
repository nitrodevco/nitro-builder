import { Container } from 'pixi.js';
import { IAssetPlane, IVector3D } from '../../../../../../../api';
import { FloorPlane } from './FloorPlane';
import { PlaneRasterizer } from './PlaneRasterizer';

export class FloorRasterizer extends PlaneRasterizer
{
    protected initializePlanes(): void
    {
        if(!this.data) return;

        const floors = this.data.planes;

        if(floors && floors.length) this.parseFloors(floors);
    }

    private parseFloors(k: IAssetPlane[]): void
    {
        if(!k) return;

        for(const floorIndex in k)
        {
            const floor = k[floorIndex];

            if(!floor) continue;

            const id = floor.id;
            const visualization = floor.visualizations;
            const plane = new FloorPlane();

            this.parseVisualizations(plane, visualization);

            this.addPlane(id, plane);
        }
    }

    public render(planeId: string, container: Container, id: string, width: number, height: number, scale: number, normal: IVector3D, useTexture: boolean, offsetX: number = 0, offsetY: number = 0, maxX: number = 0, maxY: number = 0, timeSinceStartMs: number = 0): void
    {
        const plane = (this.getPlane(id) ?? this.getPlane(PlaneRasterizer.DEFAULT)) as FloorPlane;

        if(!plane) return;

        plane.render(planeId, container, width, height, scale, normal, useTexture, offsetX, offsetY);
    }
}
