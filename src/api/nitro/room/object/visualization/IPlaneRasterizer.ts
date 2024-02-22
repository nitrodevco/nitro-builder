import { Container } from 'pixi.js';
import { IVector3D } from '../../../../utils';

export interface IPlaneRasterizer
{
    initializeDimensions(_arg_1: number, _arg_2: number): boolean;
    render(planeId: string, container: Container, id: string, width: number, height: number, scale: number, normal: IVector3D, useTexture: boolean, offsetX?: number, offsetY?: number, maxX?: number, maxY?: number, timeSinceStartMs?: number): void;
    getTextureIdentifier(_arg_1: number, _arg_2: IVector3D): string;
}
