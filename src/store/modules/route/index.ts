import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { fetchUserRoutes } from '@/service';
import { transformAuthRouteToMenu, transformAuthRoutesToVueRoutes } from '@/utils';
import type { GlobalMenuOption } from '@/interface';
import { useTabStore } from '../tab';

interface RouteState {
  /** 是否添加过动态路由 */
  isAddedDynamicRoute: boolean;
  /** 路由首页name */
  routeHomeName: AuthRoute.RouteKey;
  /** 菜单 */
  menus: GlobalMenuOption[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isAddedDynamicRoute: false,
    routeHomeName: 'dashboard_analysis',
    menus: []
  }),
  actions: {
    /**
     * 初始化动态路由
     * @param router - 路由实例
     */
    async initDynamicRoute(router: Router) {
      const { initHomeTab } = useTabStore();

      const { data } = await fetchUserRoutes();
      if (data) {
        this.routeHomeName = data.home;
        this.menus = transformAuthRouteToMenu(data.routes);

        const vueRoutes = transformAuthRoutesToVueRoutes(data.routes);
        vueRoutes.forEach(route => {
          router.addRoute(route);
        });

        initHomeTab(data.home, router);
        this.isAddedDynamicRoute = true;
      }
    }
  }
});
