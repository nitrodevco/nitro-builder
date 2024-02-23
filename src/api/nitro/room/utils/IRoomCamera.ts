import { IVector3D } from '../../../utils';

export interface IRoomCamera
{
    readonly location: IVector3D;
    targetId: number;
    targetCategory: number
    targetObjectLoc: IVector3D;
    limitedLocationX: boolean;
    limitedLocationY: boolean;
    centeredLocX: boolean;
    centeredLocY: boolean;
    screenWd: number;
    screenHt: number;
    scale: number
    roomWd: number;
    roomHt: number;
    geometryUpdateId: number;
    readonly isMoving: boolean;
    target: IVector3D;
    dispose(): void;
    initializeLocation(k: IVector3D): void;
    resetLocation(k: IVector3D): void;
    update(k: number, _arg_2: number): void;
    reset(): void;
    activateFollowing(k: number): void;
}
