import { CircleScoreSlotPosition } from '../../modules/score/components/score/circle-score-slots';

export class ContactScore {
    slot: CircleScoreSlotPosition;
    slotType: 'inner' | 'outer' | 'hidden' | 'random';
    isTinySlot = false;
    score: number;
    rssi: number;
    userId = '';
}
