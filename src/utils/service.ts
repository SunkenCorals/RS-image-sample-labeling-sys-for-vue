import json5 from 'json5';

/**
 * 创建 API 服务配置
 *
 * @param env - 读取 .env 配置
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;

  let other = {} as Record<string, string>;
  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    console.error('❌ VITE_OTHER_SERVICE_BASE_URL 格式错误');
  }

  // 主 API 配置
  const httpConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  // 解析 `proxyPattern`，确保 `key` 传递正确
  const otherConfig = Object.entries(other).map(([key, value]) => ({
    key,
    baseURL: value,
    proxyPattern: `/${key.replace(/^\//, '')}` // ✅ **直接使用 `/wegismarkapi` 形式**
  }));

  return {
    baseURL: httpConfig.baseURL,
    proxyPattern: '/', // ✅ 让主 API 代理不加 `proxy-default`
    other: otherConfig
  };
}

/**
 * 获取 API 代理的 BaseURL
 *
 * @param env - 读取 .env 配置
 * @param isProxy - 是否启用代理
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  const { baseURL, other } = createServiceConfig(env);

  const otherBaseURL = {} as Record<string, string>;

  other.forEach(item => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  return {
    baseURL: isProxy ? '/' : baseURL, // ✅ **确保主 API 代理使用 `/`**
    otherBaseURL
  };
}

/**
 * Get proxy pattern of backend service base url
 *
 * @param key If not set, will use the default key
 */
// function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
//   if (!key) {
//     return '/proxy-default';
//   }
//
//   return `/proxy-${key}`;
// }
