import { IRoomSpriteMouseEvent } from '../IRoomSpriteMouseEvent';
import { IRoomObject } from '../object';
import { IRoomGeometry } from '../utils/IRoomGeometry';

export interface IRoomCanvasMouseListener
{
    processRoomCanvasMouseEvent(event: IRoomSpriteMouseEvent, object: IRoomObject, geometry: IRoomGeometry): void
}
