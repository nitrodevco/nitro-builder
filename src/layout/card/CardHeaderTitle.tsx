import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { cls } from '../../api';

const classes = {
    base: 'text-lg text-gray-500'
}

interface CardHeaderTitleProps
{
}

export const CardHeaderTitle = forwardRef<HTMLSpanElement, PropsWithChildren<CardHeaderTitleProps> & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>((props, ref) =>
{
    const { className = '', ...rest } = props;

    return (
        <span
            ref={ ref }
            className={ cls(`
                ${ classes.base }
                ${ className }`)
            }
            { ...rest } />
    );
});

CardHeaderTitle.displayName = 'CardHeaderTitle';
