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
        bottom: '0vw',
        left: '0vw'
    },

    // bottom right
    {
        bottom: '0vw',
        right: '0vw'
    },

    // top left
    {
        top: '0vw',
        left: '0vw'
    },

    // top right
    {
        top: '0vw',
        right: '0vw'
    }
];

export const innerCircleScoreSlots: CircleScoreSlot[] = [
    // top left
    {
        top: '18vw',
        left: '18vw',
    },

    // bottom left
    {
        bottom: '18vw',
        left: '18vw',
    },

    // top right
    {
        top: '18vw',
        right: '18vw',
    },

    // bottom right
    {
        bottom: '18vw',
        right: '18vw',
    }
];

export const hiddenSlot: CircleScoreSlot = {
    top: '-5000px',
    left: '-5000px'
};
