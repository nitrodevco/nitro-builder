import { useEffect } from 'react';
import { useBetween } from 'use-between';
import { useNitroBundle } from './useNitroBundle';

const useFileUploaderHook = () =>
{
    const { importBundle = null } = useNitroBundle();

    useEffect(() =>
    {
        const onDrop = async (event: DragEvent) =>
        {
            event.preventDefault();

            try
            {
                const file = event?.dataTransfer?.files?.[0];

                if(!file) return;

                await importBundle(file);
            }

            catch(err)
            {
                console.error(err);
            }
        }

        document.body.addEventListener('dragenter', event =>
        {
            event.preventDefault();
        });

        document.body.addEventListener('dragover', event =>
        {
            event.preventDefault();
        });

        document.body.addEventListener('drop', onDrop);

        return () =>
        {
            document.body.removeEventListener('drop', onDrop);
        }
    }, [ importBundle ]);

    return {};
}

export const useFileUploader = () => useBetween(useFileUploaderHook);
