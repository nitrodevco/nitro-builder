import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'flex items-center justify-center px-1.5 py-1 text-xs text-ellipsis overflow-hidden gap-1 bg-gray-300 rounded-md',
}

interface BadgeProps
{
}

export const Badge = forwardRef<HTMLSpanElement, PropsWithChildren<BadgeProps> & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <span
            ref={ ref }
            className={ classNames(
                classes.base,
                className
            ) }
            { ...rest } />
    );
});

Badge.displayName = 'Badge';
