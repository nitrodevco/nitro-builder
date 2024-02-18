import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../classNames';

const classes = {
    base: 'table-header-group bg-gray-50 top-0',
    sticky: 'sticky'
}

interface TableHeaderGroupProps
{
    sticky?: boolean;
}

export const TableHeaderGroup = forwardRef<HTMLDivElement, PropsWithChildren<TableHeaderGroupProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { sticky = true, className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                classes.base,
                sticky && classes.sticky,
                className
            ) }
            { ...rest } />
    );
});

TableHeaderGroup.displayName = 'TableHeaderGroup';
