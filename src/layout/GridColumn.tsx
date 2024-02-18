import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'flex'
}

interface GridColumnProps
{
    start?: number;
    end?: number;
    span?: number;
}

export const GridColumn = forwardRef<HTMLDivElement, PropsWithChildren<GridColumnProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { start = undefined, end = undefined, span = undefined, className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                classes.base,
                start && (start > 0) && `col-start-${ start }`,
                end && (end > 0) && `col-end-${ end }`,
                span && (span > 0) && `col-span-${ span }`,
                className
            ) }
            { ...rest } />
    );
});

GridColumn.displayName = 'GridColumn';
