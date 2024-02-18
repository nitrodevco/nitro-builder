import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { cls } from '../../api';

const classes = {
    base: 'flex justify-between bg-gray-100 border-b py-2 px-4 select-none items-center overflow-hidden h-full max-h-[40px]'
}

interface CardHeaderProps
{
}

export const CardHeader = forwardRef<HTMLDivElement, PropsWithChildren<CardHeaderProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { className = '', ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ cls(`
                ${ classes.base }
                ${ className }`)
            }
            { ...rest } />
    );
});

CardHeader.displayName = 'CardHeader';
