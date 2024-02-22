import { IRoomGeometry } from '../../../../../../../api';

export class PlaneVisualization
{
    private _geometry: IRoomGeometry;

    constructor(geometry: IRoomGeometry)
    {
        this._geometry = geometry;
    }

    public get geometry(): IRoomGeometry
    {
        return this._geometry;
    }
}
