import { CircleScoreSlotPosition } from '../../modules/score/components/score/circle-score-slots';
import { Observable } from 'rxjs';
import { GetUserScoreResponse } from '../../services/api-services/user.service';

export class ContactScore {
    slot: CircleScoreSlotPosition;
    slotType: 'inner' | 'outer' | 'hidden' | 'random';
    isTinySlot = false;
    score: number;
    scoreAsync: Observable<GetUserScoreResponse>;
    rssi: number;
    userId = '';
    lastSeenTimestamp: number = null;
}
