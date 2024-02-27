import { RoomVariableEnum, Vector3d } from '../api';
import { GetRoomEngine } from './GetRoomEngine';
import { RoomGeometry } from './room';

export const CenterRoom = (roomId: number, canvasId: number) =>
{
    const roomEngine = GetRoomEngine();
    const geometry = roomEngine.getRoomInstanceGeometry(roomId, canvasId) as RoomGeometry;

    if(geometry)
    {
        const minX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
        const maxX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
        const minY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
        const maxY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

        let x = ((minX + maxX) / 2);
        let y = ((minY + maxY) / 2);

        const offset = 20;

        x = (x + (offset - 1));
        y = (y + (offset - 1));

        const z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

        geometry.location = new Vector3d(x, y, z);
    }
}
