import { FC } from 'react';
import { useLanguage } from '../../hooks';
import { Flex, Label } from '../../layout';
import { OpenFileComponent } from '../open-file';

export const WelcomeComponent: FC<{}> = props =>
{
    const { localizeText } = useLanguage();

    return (
        <Flex
            justifyContent="center"
            className="z-10 w-full h-full p-4 overflow-auto">
            <div
                className="container w-full h-full">
                <span className="text-2xl">{ localizeText('application.name') }</span>
                <Flex
                    column>
                    <Label>{ localizeText('welcome.start') }</Label>
                    <Flex
                        column>
                        <Flex
                            className="gap-2">
                            <Label>{ localizeText('open.file') }</Label>
                            <OpenFileComponent />
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    );
}
