import { FC, useRef } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { useNitroBundle, useRoomPreviewer } from '../../hooks';
import { Button, Flex } from '../../layout';
import { GetRoomEngine } from '../../nitro';

export const EditorCanvasToolsComponent: FC<{}> = props =>
{
    const { assetData = null, setAssetData = null, spritesheet = null } = useNitroBundle();
    const { roomPreviewer = null, centerRoom = null } = useRoomPreviewer();
    const elementRef = useRef<HTMLDivElement>();

    if(!roomPreviewer) return null;

    const zoomIn = () =>
    {
        let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1);

        switch(scale)
        {
            case 0.5:
                scale = 1;
                break;
            case 8:
                return;
            default:
                scale += 1;
        }

        GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1, scale);
    }

    const zoomOut = () =>
    {
        let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1);

        switch(scale)
        {
            case 0.5:
                return;
            case 1:
                scale = 0.5;
                break;
            default:
                scale -= 1;
        }

        GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomPreviewer.roomId, 1, scale);
    }

    return (
        <Flex className="absolute gap-1 p-1 bg-gray-800 rounded-md bg-opacity-80 top-2 right-2">
            <Flex className="gap-1">
                <Button
                    color="dark"
                    size="sm"
                    onClick={ () => zoomOut() }>
                    <MdZoomOut />
                </Button>
                <Button
                    color="dark"
                    size="sm"
                    onClick={ () => zoomIn() }>
                    <MdZoomIn />
                </Button>
            </Flex>
        </Flex>
    );
}
