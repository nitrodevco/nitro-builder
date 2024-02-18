import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../classNames';

const classes = {
    base: 'table-cell p-2 overflow-hidden text-ellipsis text-sm text-gray-800 whitespace-nowrap align-middle border-b-[1px] border-gray-300',
}

interface TableRowCellProps
{
}

export const TableRowCell = forwardRef<HTMLDivElement, PropsWithChildren<TableRowCellProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
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

TableRowCell.displayName = 'TableRowCell';
