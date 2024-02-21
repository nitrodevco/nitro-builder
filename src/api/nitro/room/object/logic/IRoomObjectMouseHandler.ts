import { IRoomSpriteMouseEvent } from '../../IRoomSpriteMouseEvent';
import { IRoomGeometry } from '../../utils/IRoomGeometry';

export interface IRoomObjectMouseHandler
{
    mouseEvent(event: IRoomSpriteMouseEvent, geometry: IRoomGeometry): void;
}
