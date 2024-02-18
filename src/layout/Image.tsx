import { DetailedHTMLProps, forwardRef, ImgHTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: ''
}

interface ImageProps
{
}

export const Image = forwardRef<HTMLImageElement, PropsWithChildren<ImageProps> & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <img
            ref={ ref }
            className={ classNames(
                classes.base,
                className
            ) }
            { ...rest } />
    );
});

Image.displayName = 'Image';
