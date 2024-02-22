import { ChangeEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useNitroBundle } from '../../hooks';
import { Input } from '../../layout';

export const OpenFileComponent: FC<{}> = props =>
{
    const { importBundle = null } = useNitroBundle();
    const navigate = useNavigate();
    const { localizeText } = useLanguage();

    const changeEvent = (e: ChangeEvent<HTMLInputElement>) =>
    {
        (async () =>
        {
            const file = e?.target?.files?.[0];

            if(!file) return;

            try
            {
                const file = e?.target?.files?.[0];

                if(!file) return;

                await importBundle(file);

                navigate(`/editor/${ file.name }`);
            }

            catch(err)
            {
                console.error(err);
            }
        })();
    }

    return (
        <Input
            type="file"
            accept=".nitro"
            onChange={ changeEvent }
        />
    );
}
