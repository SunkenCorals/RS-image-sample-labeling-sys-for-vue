import { watch } from 'vue';
import type {
  LocationQueryRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router
} from 'vue-router';
import type { RouteKey, RoutePath } from '@elegant-router/types';
import { useRouteStore } from '@/store/modules/route';
import { useUserStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getRouteName } from '@/router/elegant/transform';

/**
 * 创建路由守卫
 *
 * @param router Vue Router 实例
 */
export function createRouteGuard(router: Router) {
  const authStore = useUserStore();
  const routeStore = useRouteStore();

  // 监听 `token` 和 `userInfo` 变化
  watch(
    () => authStore.token, // ✅ 监听 `token` 变化
    async (newToken, _oldToken) => {
      console.log('🚀 监听到 token 变化', { newToken });

      if (!newToken) {
        console.log('🔴 Token 为空，跳转到登录页');
        await routeStore.resetStore();
        router.push({ name: 'login' });
      } else {
        console.log('🟢 用户登录成功，初始化用户信息');
        await authStore.initUserInfo();
        await routeStore.initAuthRoute();
        router.push({ name: 'root' });
      }
    },
    { deep: true, immediate: true }
  );

  // 路由前置守卫
  router.beforeEach(async (to, from, next) => {
    const location = await initRoute(to);
    const isLogin = Boolean(authStore.token || localStg.get('token'));

    if (location) {
      next(location);
      return;
    }

    const rootRoute: RouteKey = 'root';
    const loginRoute: RouteKey = 'login';

    const needLogin = !to.meta.constant;

    console.log('🔍 用户登录状态:', isLogin, '访问路径:', to.fullPath);

    // 如果已经登录，但访问的是 `login` 页面，则跳转到 `root`
    if (to.name === loginRoute && isLogin) {
      console.log('🔄 已登录，跳转到主页');
      next({ name: rootRoute });
      return;
    }

    // 如果页面不需要登录，则直接放行
    if (!needLogin) {
      handleRouteSwitch(to, from, next);
      return;
    }

    // 需要登录，但用户未登录，跳转到 `login`
    if (!isLogin) {
      next({ name: loginRoute, query: { redirect: to.fullPath } });
      return;
    }

    // 正常切换路由
    handleRouteSwitch(to, from, next);
  });
}

/**
 * 初始化路由
 *
 * @param to 目标路由
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore();
  const notFoundRoute: RouteKey = 'not-found';
  const isNotFoundRoute = to.name === notFoundRoute;

  // 初始化固定路由
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute();

    return {
      path: to.fullPath,
      replace: true,
      query: to.query,
      hash: to.hash
    };
  }

  const isLogin = Boolean(localStg.get('token'));

  if (!isLogin) {
    if (to.meta.constant && !isNotFoundRoute) {
      await routeStore.onRouteSwitchWhenNotLoggedIn();
      return null;
    }

    return {
      name: 'login',
      query: getRouteQueryOfLoginRoute(to, routeStore.routeHome)
    };
  }

  if (!routeStore.isInitAuthRoute) {
    await routeStore.initAuthRoute();

    if (isNotFoundRoute) {
      return {
        path: to.redirectedFrom?.name === 'root' ? '/' : to.fullPath,
        replace: true,
        query: to.query,
        hash: to.hash
      };
    }
  }

  await routeStore.onRouteSwitchWhenLoggedIn();

  if (!isNotFoundRoute) {
    return null;
  }

  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);

  return exist ? { name: '403' } : null;
}

/** 处理路由切换 */
function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');
    next({ path: from.fullPath, replace: true, query: from.query, hash: to.hash });
    return;
  }
  next();
}

/** 获取登录页面的重定向参数 */
function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  const redirect = to.fullPath;
  const [redirectPath, redirectQuery] = redirect.split('?');
  const redirectName = getRouteName(redirectPath as RoutePath);
  const isRedirectHome = routeHome === redirectName;

  const query: LocationQueryRaw = to.name !== 'login' && !isRedirectHome ? { redirect } : {};

  if (isRedirectHome && redirectQuery) {
    query.redirect = `/?${redirectQuery}`;
  }

  return query;
}
