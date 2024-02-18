import { useCallback, useMemo, useState } from 'react';
import { matchRoutes } from 'react-router-dom';
import { useBetween } from 'use-between';
import { IRoute } from '../api';
import { NitroBuilderRoutes } from './NitroBuilderRoutes';

let ROUTE_UNIQUE_ID: number = -1;

const useNitroBuilderRoutesHook = () =>
{
    const [ routeMap, setRouteMap ] = useState<{ path: string, route: IRoute }[]>(null);
    const [ activePath, setActivePath ] = useState<string>('');

    const routes = useMemo(() =>
    {
        const processRoutes = (routes: IRoute[], parent: IRoute = null, allRoutes: { path: string, route: IRoute }[] = []) =>
        {
            const addToRouteMap = (route: IRoute, pathNames: string[] = []) =>
            {
                const doRoute = (route: IRoute) =>
                {
                    pathNames.push(route.path);

                    if(route.parent) doRoute(route.parent);
                }

                doRoute(route);

                pathNames.reverse();

                let pathName = pathNames.join('/');

                if(pathName.startsWith('//')) pathName = pathName.slice(1);

                route.fullPath = pathName;

                allRoutes.push({ path: route.fullPath, route });
            }
    
            const allowedRoutes: IRoute[] = [];

            routes.forEach(route =>
            {
                route.uniqueId = ROUTE_UNIQUE_ID++;
                
                /* if(route.preventLoggedIn && user) return;

                let mustLogin = (route.loginRequired || (route.permission && route.permission.length));

                if(mustLogin && !user) return;

                if((route.permission && route.permission.length) && !hasPermissionName(route.permission)) return; */

                if(parent) route.parent = parent;

                if(route.children && route.children.length)
                {
                    route.children = processRoutes(route.children, route, allRoutes);

                    if(!route.children || !route.children.length) return;
                }
                else
                {
                    route.children = [];
                }

                allowedRoutes.push(route);

                if(!route.redirect) addToRouteMap(route);
            });

            setRouteMap(allRoutes);

            return allowedRoutes;
        }

        return processRoutes(NitroBuilderRoutes(false), null)
    }, [ ]);

    const getRouteForPath = useCallback((path: string) =>
    {
        const matches = matchRoutes(routeMap, path);
        
        if(!matches || !matches.length) return null;

        const match = matches[0];

        return routeMap.find(route => (route.path === match?.route?.path))?.route ?? null;
    }, [ routeMap ]);

    const activeRoutes = useMemo(() =>
    {
        if(!activePath) return [];

        const route = getRouteForPath(activePath);

        if(!route) return [];
        
        const pages: IRoute[] = [];

        const addPage = (route: IRoute) =>
        {
            pages.push(route);

            if(route.parent && route.parent.parent) addPage(route.parent);
        }

        addPage(route);

        pages.reverse();

        return pages;
    }, [ activePath, getRouteForPath ]);

    return { routes, activePath, setActivePath, getRouteForPath, activeRoutes };
}

export const useNitroBuilderRoutes = () => useBetween(useNitroBuilderRoutesHook);
