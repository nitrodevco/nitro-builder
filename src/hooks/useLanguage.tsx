import { Fragment, ReactElement, useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import EnglishTranslation from '../translations/EnglishTranslation.json';

const useLanguageHook = () =>
{
    const [ localizations, setLocalizations ] = useState<{ [index: string]: string }[]>([]);

    const localizeText = useCallback((key: string, ...replaceValues: (string | number | ReactElement)[]) =>
    {
        let value = ((localizations && localizations[key]) ?? key) as string;

        if (!replaceValues.length) return value;

        value = value.replace(/ /g, '\u00a0');

        const elements: ReactElement[] = [];
        const replaceCopy = replaceValues.concat();
        const parts = value.split(/(%)/);

        parts.forEach(part =>
        {
            if (part !== '%') elements.push(<span>
                { part }
            </span>);
            else elements.push(<>
                { replaceCopy.shift() }
            </>);
        });

        return <>
            { elements.map((element, index) => <Fragment
                key={ index }>
                { element }
            </Fragment>) }
        </>
    }, [ localizations ]);

    useEffect(() =>
    {
        const languageLocalizations: { [index: string]: string }[] = [];
        
        Object.keys(EnglishTranslation).forEach(key => languageLocalizations[key] = EnglishTranslation[key]);

        setLocalizations(languageLocalizations);
    }, [ ]);

    return { localizeText };
}

export const useLanguage = () => useBetween(useLanguageHook);
