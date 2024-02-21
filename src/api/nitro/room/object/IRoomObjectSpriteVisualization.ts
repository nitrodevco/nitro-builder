import { IRoomObjectGraphicVisualization } from './visualization/IRoomObjectGraphicVisualization';
import { IRoomObjectSprite } from './visualization/IRoomObjectSprite';

export interface IRoomObjectSpriteVisualization extends IRoomObjectGraphicVisualization
{
    getSprite(index: number): IRoomObjectSprite;
    sprites: IRoomObjectSprite[];
    updateObjectCounter: number;
    updateModelCounter: number;
}
