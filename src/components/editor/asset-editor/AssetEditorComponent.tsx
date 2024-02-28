import { FC } from 'react';
import { Card, CardBody, CardHeader, CardHeaderTitle } from '../../../layout';
import { AssetEditorListComponent } from './AssetEditorListComponent';

export const AssetEditorComponent: FC<{}> = props =>
{
    return (
        <Card
            className="h-full">
            <CardHeader>
                <CardHeaderTitle>Asset Editor</CardHeaderTitle>
            </CardHeader>
            <CardBody
                className="gap-1 overflow-auto">
                <AssetEditorListComponent />
            </CardBody>
        </Card>
    );
}
