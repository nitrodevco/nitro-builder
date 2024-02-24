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
            alignItems="center"
            className="z-10 w-full h-full overflow-auto">
            <Flex className="w-fit h-fit">
                <Container title={ `${ localizeText('application.name') }` }>
                    <Flex justifyContent="center" className="p-1 gap-2 text-white">
                        <Flex column className="gap-1">
                            <span className="text-2xl">{ localizeText('application.name') }</span>
                            <Flex column className="gap-8 w-72">
                                <Label>{ localizeText('welcome.start') }</Label>
                                <span>{ localizeText('open.file') }</span>
                            </Flex>
                        </Flex>
                        <div className="nitro-builder-welcome" />
                    </Flex>
                </Container>
            </Flex>
        </Flex>
    );
}
