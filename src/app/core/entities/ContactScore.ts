import { CircleScoreSlot } from '../../modules/score/components/score/circle-score-slots';

export class ContactScore {
    slot: CircleScoreSlot;
    slotType: 'inner' | 'outer' | 'hidden';
    score: number;
    rssi: number;
}
