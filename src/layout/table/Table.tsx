import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../classNames';

const classes = {
    base: 'table border-separate table-fixed w-full',
}

interface TableProps
{
}

export const Table = forwardRef<HTMLDivElement, PropsWithChildren<TableProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                classes.base,
                className
            ) }
            { ...rest } />
    );
});

Table.displayName = 'Table';
