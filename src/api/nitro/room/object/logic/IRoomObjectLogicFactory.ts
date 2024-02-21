import { IEventDispatcher, IRoomObjectEvent } from '../../../events';
import { IRoomObjectEventHandler } from './IRoomObjectEventHandler';

export interface IRoomObjectLogicFactory
{
    getLogic(type: string): IRoomObjectEventHandler;
    registerEventFunction(func: (event: IRoomObjectEvent) => void): void;
    removeEventFunction(func: (event: IRoomObjectEvent) => void): void;
    events: IEventDispatcher;
}
