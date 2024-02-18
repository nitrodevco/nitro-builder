import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'grid gap-2'
}

interface IProps
{
    cols?: number;
}

export const Row = forwardRef<HTMLDivElement, PropsWithChildren<IProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { cols = 12, className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                classes.base,
                cols && (cols > 0) && `grid-cols-${ cols }`,
                className
            ) }
            { ...rest } />
    );
});

Row.displayName = 'Row';
