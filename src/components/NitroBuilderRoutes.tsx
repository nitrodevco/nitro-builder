import { IRoute } from '../api';
import { BaseComponent } from './BaseComponent';
import { EditorComponent } from './editor';
import { WelcomeComponent } from './welcome';

export const NitroBuilderRoutes = (loggedIn: boolean): IRoute[] =>
{
    return [
        {
            path: '/',
            element: <BaseComponent />,
            children: [
                {
                    index: true,
                    redirect: 'welcome',
                    hide: true
                },
                {
                    name: 'Welcome',
                    path: 'welcome',
                    element: <WelcomeComponent />,
                },
                {
                    name: 'Editor',
                    path: 'editor/:fileName',
                    element: <EditorComponent />
                }
            ]
        }
    ];
}
