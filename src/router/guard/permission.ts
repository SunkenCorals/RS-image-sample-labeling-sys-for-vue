import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore, useRouteStore } from '@/store';
import { exeStrategyActions } from '@/utils';

/** 处理路由页面的权限 */
export async function handlePagePermission(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const auth = useAuthStore();
  const route = useRouteStore();
  const { initDynamicRoute, getRouteName } = useRouteStore();

  const permissions = to.meta.permissions || [];
  const needLogin = Boolean(to.meta?.requiresAuth) || Boolean(permissions.length);
  const hasPermission = !permissions.length || permissions.includes(auth.userInfo.userRole);

  if (!route.isAddedDynamicRoute) {
    // 添加动态路由
    await initDynamicRoute(router);

    if (to.name === getRouteName('redirect-not-found')) {
      // 动态路由没有加载导致重定向到了redirect-not-found，等待动态路由加载好了，回到重定向之前的路由
      next({ path: to.fullPath, replace: true, query: to.query });
      return;
    }
  }

  const actions: Common.StrategyAction[] = [
    // 已登录状态跳转登录页，跳转至首页
    [
      auth.isLogin && to.name === getRouteName('login'),
      () => {
        next({ name: getRouteName('root') });
      }
    ],
    // 不需要登录权限的页面直接通行
    [
      !needLogin,
      () => {
        next();
      }
    ],
    // 未登录状态进入需要登录权限的页面
    [
      !auth.isLogin && needLogin,
      () => {
        const redirect = to.fullPath;
        next({ name: getRouteName('login'), query: { redirect } });
      }
    ],
    // 登录状态进入需要登录权限的页面，有权限直接通行
    [
      auth.isLogin && needLogin && hasPermission,
      () => {
        next();
      }
    ],
    [
      // 登录状态进入需要登录权限的页面，无权限，重定向到无权限页面
      auth.isLogin && needLogin && !hasPermission,
      () => {
        next({ name: getRouteName('no-permission') });
      }
    ]
  ];

  exeStrategyActions(actions);
}
