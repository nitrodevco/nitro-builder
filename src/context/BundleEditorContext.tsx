import { createContext } from 'react';
import { RoomPreviewer } from '../nitro';

export const BundleEditorContext = createContext<{ roomPreviewer: RoomPreviewer }>({
    roomPreviewer: null
});
