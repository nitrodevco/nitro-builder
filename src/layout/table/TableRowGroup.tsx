import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../classNames';

const classes = {
    base: 'table-row-group bg-white',
}

interface TableHeaderGroupProps
{
}

export const TableRowGroup = forwardRef<HTMLDivElement, PropsWithChildren<TableHeaderGroupProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
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

TableRowGroup.displayName = 'TableRowGroup';
