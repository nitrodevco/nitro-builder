import { FC } from 'react';
import { useLanguage } from '../../hooks';
import { Flex, Label } from '../../layout';
import { Container } from '../../layout/Container';

export const WelcomeComponent: FC<{}> = props =>
{
    const { localizeText } = useLanguage();

    return (
        <Flex
            justifyContent="center"
            className="z-10 w-full h-full p-48 overflow-auto">
            <Container title={ `${ localizeText('application.name') }` }>
                <Flex column className="p-1 gap-2">
                    <span className="text-2xl">{ localizeText('application.name') }</span>
                    <Label>{ localizeText('welcome.start') }</Label>
                    <div className="nitro-builder-welcome" />
                    <Flex
                        column>
                        <Flex
                            className="gap-2">
                            <Label>{ localizeText('open.file') }</Label>
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
        </Flex>
    );
}
