import { IRoomEngine, IRoomSession, IRoomSessionManager } from '../../api';
import { NitroEventDispatcher, RoomSessionEvent } from '../events';
import { RoomSession } from './RoomSession';

export class RoomSessionManager implements IRoomSessionManager
{
    private _roomEngine: IRoomEngine;

    private _sessions: Map<string, IRoomSession> = new Map();
    private _pendingSession: IRoomSession = null;

    private _sessionStarting: boolean = false;
    private _viewerSession: IRoomSession = null;

    constructor(roomEngine: IRoomEngine)
    {
        this._roomEngine = roomEngine;
    }

    public async init(): Promise<void>
    {
        this.processPendingSession();
    }

    private processPendingSession(): void
    {
        if(!this._pendingSession) return;

        this.addSession(this._pendingSession);

        this._pendingSession = null;
    }

    public getSession(id: number): IRoomSession
    {
        const existing = this._sessions.get(this.getRoomId(id));

        if(!existing) return null;

        return existing;
    }

    public createSession(roomId: number, password: string = null): boolean
    {
        const session = new RoomSession();

        session.roomId = roomId;
        session.password = password;

        return this.addSession(session);
    }

    private addSession(roomSession: IRoomSession): boolean
    {
        this._sessionStarting = true;

        if(this._sessions.get(this.getRoomId(roomSession.roomId)))
        {
            this.removeSession(roomSession.roomId, false);
        }

        this._sessions.set(this.getRoomId(roomSession.roomId), roomSession);

        NitroEventDispatcher.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.CREATED, roomSession));

        this._viewerSession = roomSession;

        this.startSession(this._viewerSession);

        return true;
    }

    public startSession(session: IRoomSession): boolean
    {
        if(session.state === RoomSessionEvent.STARTED) return false;

        this._sessionStarting = false;

        if(!session.start())
        {
            this.removeSession(session.roomId);

            return false;
        }

        NitroEventDispatcher.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.STARTED, session));

        return true;
    }

    public removeSession(id: number, openLandingView: boolean = true): void
    {
        const session = this.getSession(id);

        if(!session) return;

        this._sessions.delete(this.getRoomId(id));

        NitroEventDispatcher.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.ENDED, session, openLandingView));

        session.dispose();
    }

    public sessionReinitialize(fromRoomId: number, toRoomId: number): void
    {
        const existing = this.getSession(fromRoomId);

        if(!existing) return;

        this._sessions.delete(this.getRoomId(fromRoomId));

        existing.reset(toRoomId);

        this._sessions.set(this.getRoomId(toRoomId), existing);
    }

    private getRoomId(id: number): string
    {
        return 'hard_coded_room_id';
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public get viewerSession(): IRoomSession
    {
        return this._viewerSession;
    }
}
