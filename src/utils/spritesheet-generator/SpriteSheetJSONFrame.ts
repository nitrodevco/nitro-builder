export type SpriteSheetJSONFrame = {
    [key: string]: {
        frame: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        spriteSourceSize: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        sourceSize: {
            w: number;
            h: number;
        };
        anchor: {
            x: number;
            y: number;
        };
    };
};
