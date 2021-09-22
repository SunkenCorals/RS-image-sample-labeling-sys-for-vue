import type { Component } from 'vue';
import { customRoutes } from './routes';
import type { CustomRoute, GlobalMenuOption } from '@/interface';
import { dynamicIconRender } from '@/utils';

function transformRouteToMenu(routes: CustomRoute[]) {
  const globalMenu: GlobalMenuOption[] = [];
  routes.forEach(route => {
    if (asMenu(route)) {
      const { name, path, meta } = route;
      const routeName = name as string;
      let menuChildren: GlobalMenuOption[] | undefined;
      if (route.children) {
        menuChildren = transformRouteToMenu(route.children as CustomRoute[]);
      }
      const menuItem: GlobalMenuOption = addPartialProps(
        {
          key: routeName,
          label: meta?.title ?? routeName,
          routeName,
          routePath: path
        },
        meta?.icon,
        menuChildren
      );
      globalMenu.push(menuItem);
    }
  });
  return globalMenu;
}

/** 判断路由是否作为菜单 */
function asMenu(route: CustomRoute) {
  return !route.meta?.isNotMenu;
}

/** 给菜单添加可选属性 */
function addPartialProps(menuItem: GlobalMenuOption, icon?: Component, children?: GlobalMenuOption[]) {
  const item = { ...menuItem };
  if (icon) {
    Object.assign(item, { icon: dynamicIconRender(icon) });
  }
  if (children) {
    Object.assign(item, { children });
  }
  return item;
}

export const menus = transformRouteToMenu(customRoutes);
