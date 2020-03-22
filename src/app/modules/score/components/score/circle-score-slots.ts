export interface CircleScoreSlot {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    marginTop?: number | string;
}

export const outerCircleScoreSlots: CircleScoreSlot[] = [
    // bottom left
    {
        bottom: '0px',
        left: '0px'
    },

    // bottom right
    {
        bottom: '0px',
        right: '0px'
    },

    // top left
    {
        top: '0px',
        left: '0px'
    },

    // top right
    {
        top: '0px',
        right: '0px'
    }
];

export const innerCircleScoreSlots: CircleScoreSlot[] = [
    // top middle
    {
        top: '14vw',
        left: '0px',
        right: '0px'
    },

    // bottom middle
    {
        bottom: '14vw',
        left: '0px',
        right: '0px'
    },

    // left middle
    {
        top: '40%',
        bottom: '0px',
        left: '8vw'
    },

    // right middle
    {
        top: '40%',
        bottom: '0px',
        right: '8vw'
    }
];

export const hiddenSlot: CircleScoreSlot = {
    top: '-5000px',
    left: '-5000px'
};
