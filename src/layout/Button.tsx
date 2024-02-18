import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'inline-flex justify-center items-center gap-2 transition-[background-color] duration-300 transform tracking-wide rounded-md',
    disabled: '',
    size: {
        xs: 'px-2 py-1 text-xs font-medium',
        sm: 'px-3 py-2 text-sm font-medium ',
        default: 'px-5 py-2.5 text-sm font-medium',
        lg: 'px-5 py-3 text-base font-medium',
        xl: 'px-6 py-3.5 text-base font-medium',
    },
    outline: {
        default: 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800',
        dark: 'text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800'
    },
    color: {
        default: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300',
        dark: 'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300',
        ghost: 'text-black bg-transparent hover:bg-gray-200 focus:bg-gray-300'
    }
}

interface ButtonProps
{
    color?: 'default' | 'dark' | 'ghost';
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
    outline?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps> & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>((props, ref) =>
{
    const { color = 'default', size = 'default', outline = false, disabled = false, type = 'button', className = null, ...rest } = props;

    return (
        <button
            ref={ ref }
            disabled={ disabled }
            type={ type }
            className={ classNames(
                classes.base,
                classes.size[size],
                outline ? classes.outline[color] : classes.color[color],
                disabled && classes.disabled,
                className
            ) }
            { ...rest } />
    );
});

Button.displayName = 'Button';
