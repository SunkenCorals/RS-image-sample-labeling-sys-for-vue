/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/base-layout/index.vue";
import BlankLayout from "@/layouts/blank-layout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  403: () => import("@/views/_builtin/403/index.vue"),
  404: () => import("@/views/_builtin/404/index.vue"),
  500: () => import("@/views/_builtin/500/index.vue"),
  "iframe-page": () => import("@/views/_builtin/iframe-page/[url].vue"),
  login: () => import("@/views/_builtin/login/index.vue"),
  categorymanage: () => import("@/views/categoryManage/index.vue"),
  datamanage: () => import("@/views/dataManage/index.vue"),
  home: () => import("@/views/home/index.vue"),
  markpage: () => import("@/views/markPage/index.vue"),
  servicemanage_alltask: () => import("@/views/serviceManage/allTask/index.vue"),
  servicemanage_taskpublish: () => import("@/views/serviceManage/taskPublish/index.vue"),
  usermanage: () => import("@/views/userManage/index.vue"),
};
