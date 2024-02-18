import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithChildren } from 'react';
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

export interface InputProps
{
    color?: 'default' | 'dark' | 'ghost';
    inputSize?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
    rounded?: boolean;
}

export const Input = forwardRef<HTMLInputElement, PropsWithChildren<InputProps> & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) =>
{
    const { color = 'default', inputSize = 'default', rounded = true, disabled = false, type = 'text', autoComplete = 'off', className = null, ...rest } = props;

    return (
        <input
            ref={ ref }
            disabled={ disabled }
            type={ type }
            autoComplete={ autoComplete }
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

Input.displayName = 'Input';
