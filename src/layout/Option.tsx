import { DetailedHTMLProps, forwardRef, OptionHTMLAttributes, PropsWithChildren } from 'react';

const classes = {
}

export interface OptionProps
{
}

export const Option = forwardRef<HTMLOptionElement, PropsWithChildren<OptionProps> & DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <option
            ref={ ref }
            { ...rest } />
    );
});

Option.displayName = 'Option';
