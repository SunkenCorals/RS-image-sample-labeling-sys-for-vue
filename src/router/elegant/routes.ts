/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { GeneratedRoute } from '@elegant-router/types';

export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'categorymanage',
    path: '/categorymanage',
    component: 'layout.base$view.categorymanage',
    meta: {
      title: 'categorymanage',
      i18nKey: 'route.categorymanage',
      icon: 'line-md:clipboard-list',
      order: 6
    }
  },
  {
    name: 'datamanage',
    path: '/datamanage',
    component: 'layout.base$view.datamanage',
    meta: {
      title: 'datamanage',
      i18nKey: 'route.datamanage',
      icon: 'line-md:cloud-alt-tags',
      order: 3
    }
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      i18nKey: 'route.home',
      icon: 'line-md:compass',
      order: 1
    }
  },
  {
    name: 'iframe-page',
    path: '/iframe-page/:url',
    component: 'layout.base$view.iframe-page',
    props: true,
    meta: {
      title: 'iframe-page',
      i18nKey: 'route.iframe-page',
      constant: true,
      hideInMenu: true,
      keepAlive: true
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      i18nKey: 'route.login',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'markpage',
    path: '/markpage',
    component: 'layout.base$view.markpage',
    meta: {
      title: 'markpage',
      i18nKey: 'route.markpage',
      icon: 'line-md:monitor-screenshot',
      order: 2
    }
  },
  {
    name: 'servicemanage',
    path: '/servicemanage',
    component: 'layout.base$view.servicemanage',
    meta: {
      title: 'servicemanage',
      i18nKey: 'route.servicemanage',
      icon: 'line-md:list',
      order: 3
    }
  },
  {
    name: 'usermanage',
    path: '/usermanage',
    component: 'layout.base$view.usermanage',
    meta: {
      title: 'usermanage',
      i18nKey: 'route.usermanage',
      icon: 'line-md:account',
      order: 4
    }
  }
];
