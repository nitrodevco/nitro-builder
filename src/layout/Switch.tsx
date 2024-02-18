import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithChildren } from 'react';
import { cls } from '../api';

const classes = {
    base: 'relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent focus:border-blue-600 focus:ring-blue-600 ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200'
}

interface SwitchProps
{
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    className?: string;
}

export const Switch = forwardRef<HTMLInputElement, PropsWithChildren<SwitchProps> & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) =>
{
    const { enabled = false, setEnabled = null, className = null, children = null } = props;

    return (
        <input
            type="checkbox"
            checked={ enabled }
            onChange={ event => setEnabled(event.target.checked) }
            className={ cls(`
                ${ classes.base }
                ${ className }`)
            }>
            { children }
        </input>
    );
});

Switch.displayName = 'Switch';
