import { ReactElement } from 'react';
import { To } from 'react-router-dom';

export interface IRoute
{
    uniqueId?: number;
    name?: string;
    icon?: JSX.Element;
    path?: string;
    navigateTo?: string;
    fullPath?: string;
    index?: boolean;
    redirect?: To;
    loginRequired?: boolean;
    preventLoggedIn?: boolean;
    permission?: string;
    hide?: boolean;
    children?: IRoute[];
    parent?: IRoute;
    element?: ReactElement;
}
