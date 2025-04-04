import type { ProxyOptions } from 'vite';
import { createServiceConfig } from '../../src/utils/service';

/**
 * 创建 Vite 代理
 *
 * @param env - 读取 .env 配置
 * @param enable - 是否启用代理
 */
export function createViteProxy(env: ImportMetaEnv, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) {
    console.warn('⚠️ Vite 代理未启用');
    return undefined;
  }

  const { baseURL, other } = createServiceConfig(env);
  const proxy: Record<string, ProxyOptions> = {};

  // ✅ `/wegismarkapi` 代理到 `http://localhost:8000`
  proxy['/wegismarkapi'] = {
    target: baseURL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/wegismarkapi/, '') // ✅ 让 `/wegismarkapi/user/login` 变成 `/user/login`
  };

  // 其他 API 代理
  other.forEach(item => {
    proxy[item.proxyPattern] = {
      target: item.baseURL,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '') // ✅ 确保路径正确
    };
  });

  console.log('✅ 解析后的 Vite 代理:', proxy); // 🔥 确保代理解析正确
  return proxy;
}
// function createProxyItem(item: App.Service.ServiceConfigItem) {
//   const proxy: Record<string, ProxyOptions> = {};
//
//   proxy[item.proxyPattern] = {
//     target: item.baseURL,
//     changeOrigin: true,
//     rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
//   };
//
//   return proxy;
// }
