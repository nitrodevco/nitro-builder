import { Container } from 'pixi.js';
import { IAssetPlane, IVector3D } from '../../../../../../../api';
import { PlaneRasterizer } from './PlaneRasterizer';
import { WallPlane } from './WallPlane';

export class WallRasterizer extends PlaneRasterizer
{
    protected initializePlanes(): void
    {
        if(!this.data) return;

        const walls = this.data.planes;

        if(walls && walls.length) this.parseWalls(walls);
    }

    private parseWalls(k: IAssetPlane[]): void
    {
        if(!k) return;

        for(const wallIndex in k)
        {
            const wall = k[wallIndex];

            if(!wall) continue;

            const id = wall.id;
            const visualization = wall.visualizations;
            const plane = new WallPlane();

            this.parseVisualizations(plane, visualization);
            
            this.addPlane(id, plane);
        }
    }

    public render(planeId: string, container: Container, id: string, width: number, height: number, scale: number, normal: IVector3D, useTexture: boolean, offsetX: number = 0, offsetY: number = 0, maxX: number = 0, maxY: number = 0, timeSinceStartMs: number = 0): void
    {
        const plane = (this.getPlane(id) ?? this.getPlane(PlaneRasterizer.DEFAULT)) as WallPlane;

        if(!plane) return;

        plane.render(planeId, container, width, height, scale, normal, useTexture);
    }

    public getTextureIdentifier(k: number, normal: IVector3D): string
    {
        if(normal)
        {
            return `${ k }_${ normal.x }_${ normal.y }_${ normal.z }`;
        }

        return super.getTextureIdentifier(k, normal);
    }
}
