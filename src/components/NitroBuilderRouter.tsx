import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IRoute } from '../api';
import { useNitroBuilderRoutes } from './useNitroBuilderRoutes';

export const NitroBuilderRouter: FC<{}> = props =>
{
    const { routes = [] } = useNitroBuilderRoutes();

    const getNavigationElements = (routes: IRoute[], parent = null) =>
    {
        return routes.map(route =>
        {
            return (
                <Route
                    key={ (parent ? `${ parent.path }-${ route.path }` : route.path) }
                    path={ route.path }
                    index={ route.index as any }
                    element={ (route.redirect ? <Navigate
                        to={ route.redirect } /> : route.element) }>
                    { route.children && route.children.length && getNavigationElements(route.children, route) }
                </Route>
            );
        });
    }

    return (
        <BrowserRouter>
            <Routes>
                { (routes && routes.length > 0) && getNavigationElements(routes) }
            </Routes>
        </BrowserRouter>
    );
}
