import { Assets } from 'pixi.js';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { GetAssetManager, GetPixi, GetTicker } from '../api';
import { GetRoomEngine, RoomPreviewer } from '../nitro';

const useRoomPreviewerHook = () =>
{
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);

    useEffect(() =>
    {
        const start = async () =>
        {
            await GetPixi().init({
                autoStart: false,
                autoDensity: false,
                width: 800,
                height: 600,
                sharedTicker: true,
                backgroundAlpha: 0
            });

            const floorTexture = await Assets.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFqSURBVHhe7d3BCQMgEABBkw7sv0evhATELmbnoz4PFnze55zzW2HdAPbe7+mZmSXP/31nUAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALi7Pv7dA7oByPvzZ2bJ8/cF4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAGhr/QGbURaH1s1AbQAAAABJRU5ErkJggg==');
            const wallTexture = await Assets.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAIAAAAphe5+AAABImlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGCSSCwoyGESYGDIzSspCnJ3UoiIjFJgf8HAxCDGwM9gysCTmFxc4BgQ4MMABDAaFXy7xsAIoi/rgswKPb0w+dqKfy8Vuh9KTLhV+xtTPQrgSkktTgbSf4A4KbmgqISBgTEByFYuLykAsVuAbJGkbDB7BohdBHQgkL0GxE6HsA+A1UDYV8BqQoKcgewXQDZfEoT9A8ROB7OZOEBsqL0gwBHsGxDiqutMwKmkg5LUihIQ7ZxfUFmUmZ5RouAIDKFUBc+8ZD0dBSMDIxMGBlB4Q1R/DgSHI6PYGYQYAiDEsiYxMFgA/cxchxBLWcnAsIWLgUE8ESGmPpuBQdiMgWGHX3JpURnUGEYmYwYGQnwAxmJS6VXe33UAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAERJREFUSA1j/PHjB8NQBiz37z8Yyu5nYByNgQGOv9EYGOAIGM0DAx0BozEwGgOUhsBoTUxpCFKqfzQGKA1BSvUP+RgAAMRULFkPwBOHAAAAAElFTkSuQmCC');

            GetAssetManager().setTexture('floor_texture', floorTexture);
            GetAssetManager().setTexture('wall_texture', wallTexture);

            GetAssetManager().createCollection({
                name: 'room',
                logicType: 'room',
                visualizationType: 'room'
            }, null);
            
            await GetAssetManager().downloadAsset('https://assets.nitrodev.co/bundled/generic/tile_cursor.nitro');
            
            await GetRoomEngine().init();

            GetTicker().maxFPS = window.NitroBuilderConfig['system.fps.max'];

            setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));
        }

        start();

        return () =>
        {
            setRoomPreviewer(prevValue =>
            {
                prevValue.dispose();

                return null;
            });
        }
    }, []);

    return { roomPreviewer };
}

export const useRoomPreviewer = () => useBetween(useRoomPreviewerHook);
