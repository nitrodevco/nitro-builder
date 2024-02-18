import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'block text-sm font-medium',
}

interface LabelProps
{
}

export const Label = forwardRef<HTMLLabelElement, PropsWithChildren<LabelProps> & DetailedHTMLProps<HTMLAttributes<HTMLLabelElement>, HTMLLabelElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <label
            ref={ ref }
            className={ classNames(
                classes.base,
                className
            ) }
            { ...rest } />
    );
});

Label.displayName = 'Label';
