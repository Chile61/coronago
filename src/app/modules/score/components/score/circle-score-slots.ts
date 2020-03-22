export interface CircleScoreSlot {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    marginTop?: number | string;
}

export const circleScoreSlots: CircleScoreSlot[] = [
    // top middle
    {
        top: '-46px',
        left: 0,
        right: 0
    },

    // bottom left
    {
        bottom: '10px',
        left: '10px'
    },

    // bottom right
    {
        bottom: '10px',
        right: '10px'
    },

    // top left
    {
        top: '10px',
        left: '10px'
    },

    // bottom middle
    {
        bottom: '-46px',
        left: 0,
        right: 0
    },

    // top right
    {
        top: '10px',
        right: '10px'
    },

    // left middle
    {
        top: '40%',
        bottom: 0,
        left: '-26px'
    },
    // right middle
    {
        top: '40%',
        bottom: 0,
        right: '-26px'
    }
];
