import { FC } from 'react';
import { useLanguage } from '../../hooks';
import { Flex, Label } from '../../layout';

export const WelcomeComponent: FC<{}> = props =>
{
    const { localizeText } = useLanguage();

    return (
        <Flex
            justifyContent="center"
            className="z-10 w-full h-full p-4 overflow-auto">
            <div className="w-full max-w-3xl">
                <span className="text-2xl">{ localizeText('application.name') }</span>
                <Flex
                    column>
                    <Label>{ localizeText('welcome.start') }</Label>
                    drop a file anywhere
                </Flex>
            </div>
        </Flex>
    );
}
