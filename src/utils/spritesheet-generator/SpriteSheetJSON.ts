import { SpriteSheetJSONFrame } from './SpriteSheetJSONFrame';

/**
 * The structure of the JSON data file that is generated that describes the
 * placement and dimensions of each sprite in the spritesheet.
 *
 * This also includes metadata such as the name of the spritesheet, its
 * dimensions, and the name of our CLI which generated it.
 */
export type SpriteSheetJSON = {
    meta: {
        app: string;
        version: string;
        format: string;
        image: string;
        size: {
            w: number;
            h: number;
        };
        scale: string;
    };
    frames: SpriteSheetJSONFrame;
    animations: { [key: string]: string[] };
};
