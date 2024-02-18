import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'flex',
    column: 'flex-col',
    alignItems: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch'
    },
    justifyContent: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly'
    }
}

interface FlexProps
{
    column?: boolean;
    alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
}

export const Flex = forwardRef<HTMLDivElement, PropsWithChildren<FlexProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { column = false, alignItems = null, justifyContent = null, className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                classes.base,
                column && classes.column,
                alignItems && classes.alignItems[alignItems],
                justifyContent && classes.justifyContent[justifyContent],
                className
            ) }
            { ...rest } />
    );
});

Flex.displayName = 'Flex';
