import { FC } from 'react';

interface TopBarComponentProps
{
}

export const TopBarComponent: FC<TopBarComponentProps> = props =>
{
    return (
        <div
            className="z-20 flex w-full shadow-md select-none bg-top-bar h-top-bar bg-opacity-90">
            <div
                className="flex justify-between w-full h-full px-4 py-2 text-white">
                <div
                    className="flex items-center gap-2">
                    <span
                        className="text-xl">
                            Hello
                    </span>
                </div>
            </div>
        </div>
    );
}
