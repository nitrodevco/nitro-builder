import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../classNames';

const classes = {
    base: 'table-cell p-2 text-xs font-medium text-left text-gray-500 uppercase select-none h-[inherit] border-b-2 border-gray-300',
}

interface TableHeaderCellProps
{
}

export const TableHeaderCell = forwardRef<HTMLDivElement, PropsWithChildren<TableHeaderCellProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
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

TableHeaderCell.displayName = 'TableHeaderCell';
