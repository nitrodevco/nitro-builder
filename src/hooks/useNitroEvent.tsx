import { NitroEvent, NitroEventDispatcher } from '../nitro';
import { useEventDispatcher } from './useEventDispatcher';

export const useNitroEvent = <T extends NitroEvent>(type: string | string[], handler: (event: T) => void, enabled = true) => useEventDispatcher(type, NitroEventDispatcher, handler, enabled);
