import { IObjectData, IRoomObjectModel, ObjectDataKey, RoomObjectVariable } from '../../../../../api';
import { ObjectDataBase } from '../ObjectDataBase';

export class EmptyDataType extends ObjectDataBase implements IObjectData
{
    public static FORMAT_KEY = ObjectDataKey.EMPTY_KEY;

    private _state: string;

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectVariable.FURNITURE_DATA_FORMAT, EmptyDataType.FORMAT_KEY);
    }

    public getLegacyString(): string
    {
        return this._state;
    }

    public compare(data: IObjectData): boolean
    {
        return super.compare(data);
    }
}
