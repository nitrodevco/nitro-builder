import { RoomPlaneParser } from './room';

export const CreatePlaneParser = (width: number, height: number) =>
{
    const planeParser = new RoomPlaneParser();

    planeParser.initializeTileMap((width + 2), (height + 2));

    let y = 1;

    while(y < (1 + height))
    {
        let x = 1;

        while(x < (1 + width))
        {
            planeParser.setTileHeight(x, y, 0);

            x++;
        }

        y++;
    }

    planeParser.initializeFromTileData();

    return planeParser;
}
