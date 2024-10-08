﻿import { IVector3D } from '../../../../utils/IVector3D';

export interface IRoomPlane
{
    uniqueId: number;
    location: IVector3D;
    leftSide: IVector3D;
    rightSide: IVector3D;
    color: number;
}
