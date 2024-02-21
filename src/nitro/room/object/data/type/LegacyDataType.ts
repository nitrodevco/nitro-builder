import { IObjectData, IRoomObjectModel, ObjectDataKey, RoomObjectVariable } from '../../../../../api';
import { ObjectDataBase } from '../ObjectDataBase';

export class LegacyDataType extends ObjectDataBase implements IObjectData
{
    public static FORMAT_KEY = ObjectDataKey.LEGACY_KEY;

    private _data: string;

    constructor()
    {
        super();

        this._data = '';
    }

    public initializeFromRoomObjectModel(model: IRoomObjectModel): void
    {
        super.initializeFromRoomObjectModel(model);

        this._data = model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
    }

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectVariable.FURNITURE_DATA_FORMAT, LegacyDataType.FORMAT_KEY);
        model.setValue(RoomObjectVariable.FURNITURE_DATA, this._data);
    }

    public getLegacyString(): string
    {
        return this._data;
    }

    public compare(data: IObjectData): boolean
    {
        return (this._data === data.getLegacyString());
    }

    public setString(data: string): void
    {
        this._data = data;
    }
}
