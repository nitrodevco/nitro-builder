import { DetailedHTMLProps, forwardRef, PropsWithChildren, SelectHTMLAttributes } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'block w-full placeholder-gray-400 border border-gray-300 shadow-sm appearance-none',
    disabled: '',
    size: {
        xs: 'px-2 py-1 text-xs font-medium',
        sm: 'px-3 py-2 text-sm font-medium ',
        default: 'px-5 py-2.5 text-sm font-medium',
        lg: 'px-5 py-3 text-base font-medium',
        xl: 'px-6 py-3.5 text-base font-medium',
    },
    rounded: 'rounded-md',
    color: {
        default: 'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
    }
}

export interface SelectProps
{
    color?: 'default' | 'dark' | 'ghost';
    inputSize?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
    rounded?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, PropsWithChildren<SelectProps> & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>>((props, ref) =>
{
    const { color = 'default', inputSize = 'default', rounded = true, disabled = false, className = null, ...rest } = props;

    return (
        <select
            ref={ ref }
            disabled={ disabled }
            className={ classNames(
                classes.base,
                classes.size[inputSize],
                rounded && classes.rounded,
                classes.color[color],
                disabled && classes.disabled,
                className
            ) }
            { ...rest } />
    );
});

Select.displayName = 'Select';
