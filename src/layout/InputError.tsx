import { DetailedHTMLProps, forwardRef, HTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { useLanguage } from '../hooks';
import { classNames } from './classNames';

const classes = {
    base: 'text-xs',
    color: {
        default: 'text-gray-500',
        danger: 'text-red-500'
    }
}

interface InputErrorProps
{
    error?: FieldError;
    message?: string | ReactNode;
}

export const InputError = forwardRef<HTMLSpanElement, InputErrorProps & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>((props, ref) =>
{
    const { error = null, message = '', color = 'danger', className = null, ...rest } = props;
    const { localizeText = null } = useLanguage();

    return (
        <span
            ref={ ref }
            className={ classNames(
                classes.base,
                classes.color[color],
                className
            ) }
            { ...rest }>
            { !error && (message ?? '') }
            { !!error && (error.type === 'custom') && localizeText(error.message ?? '') }
            { !!error && (error.type === 'required') && localizeText('input.required.error') }
            { !!error && (error.type === 'pattern') && localizeText('input.invalid.regex') }
        </span>
    );
});

InputError.displayName = 'InputMessage';
