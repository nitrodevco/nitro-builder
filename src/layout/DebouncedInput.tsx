import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
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

interface DebouncedInputProps
{
    color?: 'default' | 'dark' | 'ghost';
    inputSize?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
    rounded?: boolean;
    value: string;
    onChange: (value: string) => void;
    debounce?: number;
}

export const DebouncedInput = forwardRef<HTMLInputElement, PropsWithChildren<DebouncedInputProps> & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) =>
{
    const { value: initialValue, onChange = null, debounce = 500, color = 'default', inputSize = 'default', rounded = true, disabled = false, type = 'text', className = null, ...rest } = props;
    const [ value, setValue ] = useState<string>(initialValue);

    useEffect(() =>
    {
        setValue(initialValue);
    }, [ initialValue ]);

    useEffect(() =>
    {
        const timeout = setTimeout(() => onChange(value), debounce);

        return () => clearTimeout(timeout);
    }, [ value, debounce, onChange ]);

    return (
        <input
            ref={ ref }
            disabled={ disabled }
            type={ type }
            value={ value }
            onChange={ event => setValue(event.target.value) }
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

DebouncedInput.displayName = 'DebouncedInput';
