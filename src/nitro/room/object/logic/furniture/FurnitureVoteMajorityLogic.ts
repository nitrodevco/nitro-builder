import { RoomObjectVariable } from '../../../../../api';
import { ObjectDataUpdateMessage, RoomObjectUpdateMessage } from '../../../messages';
import { VoteDataType } from '../../data';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureVoteMajorityLogic extends FurnitureMultiStateLogic
{
    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(!this.object) return;

        if(message instanceof ObjectDataUpdateMessage)
        {
            const data = message.data;

            if(data instanceof VoteDataType) this.object.model.setValue(RoomObjectVariable.FURNITURE_VOTE_MAJORITY_RESULT, data.result);
        }
    }
}
