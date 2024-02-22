import { GetRoomEngine } from '../nitro';

export function SetActiveRoomId(roomId: number): void
{
    GetRoomEngine().setActiveRoomId(roomId);
}
