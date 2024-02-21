import { IObjectData, IRoomObjectModel, ObjectDataKey, RoomObjectVariable } from '../../../../../api';
import { ObjectDataBase } from '../ObjectDataBase';

export class StringDataType extends ObjectDataBase
{
    public static FORMAT_KEY = ObjectDataKey.STRING_KEY;

    private static STATE: number = 0;

    private _data: string[];

    constructor()
    {
        super();

        this._data = [];
    }

    public initializeFromRoomObjectModel(model: IRoomObjectModel): void
    {
        super.initializeFromRoomObjectModel(model);

        this._data = model.getValue<string[]>(RoomObjectVariable.FURNITURE_DATA);
    }

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectVariable.FURNITURE_DATA_FORMAT, StringDataType.FORMAT_KEY);
        model.setValue(RoomObjectVariable.FURNITURE_DATA, this._data);
    }

    public getLegacyString(): string
    {
        if(!this._data || !this._data.length) return '';

        return this._data[StringDataType.STATE];
    }

    public compare(data: IObjectData): boolean
    {
        if(!(data instanceof StringDataType)) return false;

        let i = 0;

        while(i < this._data.length)
        {
            if(i === 0)
            {
                //
            }
            else
            {
                if(this._data[i] !== data.getValue(i)) return false;
            }

            i++;
        }

        return true;
    }

    public getValue(index: number): string
    {
        return this._data[index] || '';
    }

    public setValue(data: string[]): void
    {
        this._data = data;
    }
}
