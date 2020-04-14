import { HelperService } from '../../../../services/helper.service';

export class CircleScoreSlotPosition {
    // These are CSS Attributes
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    animationDelay?: string;

    constructor(top?, right?, bottom?, left?) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.animationDelay = '0.' + HelperService.randomIntFromInterval(0, 9) + 's';
    }

    /**
     * Set random position
     */
    public setRandomPosition?(direction: 'outer' | 'inner'): void {
        let offset_A, offset_B, maxOffsetSum;

        if (direction === 'outer') {
            maxOffsetSum = 18;
            offset_A = HelperService.randomIntFromInterval(0, 70);
            offset_B = HelperService.randomIntFromInterval(0, 70);
        } else {
            maxOffsetSum = 52;
            offset_A = HelperService.randomIntFromInterval(18, 60);
            offset_B = HelperService.randomIntFromInterval(18, 60);
        }
        while (offset_A + offset_B > maxOffsetSum) {
            HelperService.randomIntFromInterval(0, 1) > 0 ? offset_B-- : offset_A--;
        }

        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const randomIndex = HelperService.randomIntFromInterval(0, 3);
        const position = positions[randomIndex];

        const positionParts = position.split('-');
        this[positionParts[0]] = offset_A + 'vw';
        this[positionParts[1]] = offset_B + 'vw';
    }
}

export class CircleScoreSlot {
    inner: CircleScoreSlotPosition;
    outer: CircleScoreSlotPosition;

    constructor(outer, inner) {
        this.outer = outer;
        this.inner = inner;
    }
}

export const circleScoreSlots: CircleScoreSlot[] = [
    new CircleScoreSlot(new CircleScoreSlotPosition(null, null, '0vw', '0vw'), new CircleScoreSlotPosition(null, null, '18vw', '18vw')), // bottom left
    new CircleScoreSlot(new CircleScoreSlotPosition(null, '0vw', '0vw', null), new CircleScoreSlotPosition(null, '18vw', '18vw', null)), // bottom right
    new CircleScoreSlot(new CircleScoreSlotPosition('0vw', null, null, '0vw'), new CircleScoreSlotPosition('18vw', null, null, '18vw')), // top left
    new CircleScoreSlot(new CircleScoreSlotPosition('0vw', '0vw', null, null), new CircleScoreSlotPosition('18vw', '18vw', null, null)) // top right
];

export const hiddenSlot: CircleScoreSlotPosition = {
    top: '-5000px',
    left: '-5000px'
};
