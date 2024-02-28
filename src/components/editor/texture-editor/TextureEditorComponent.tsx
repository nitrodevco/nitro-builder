import { FC } from 'react';
import { Card, CardBody, CardHeader, CardHeaderTitle } from '../../../layout';
import { TextureEditorListComponent } from './TextureEditorListComponent';

export const TextureEditorComponent: FC<{}> = props =>
{
    return (
        <Card
            className="h-full">
            <CardHeader>
                <CardHeaderTitle>Texture Editor</CardHeaderTitle>
            </CardHeader>
            <CardBody
                className="overflow-auto">
                <TextureEditorListComponent />
            </CardBody>
        </Card>
    );
}
