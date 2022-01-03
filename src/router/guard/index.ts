import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { handlePagePermission } from './permission';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuide(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();
    // 页面跳转权限处理
    await handlePagePermission(to, from, next, router);
  });
  router.afterEach(to => {
    // 设置document title
    useTitle(to.meta.title);
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });
}
