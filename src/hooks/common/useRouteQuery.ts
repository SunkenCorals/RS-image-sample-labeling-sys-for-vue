import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { RouteNameMap } from '@/router';

export default function useRouteQuery() {
  const route = useRoute();

  /** 登录跳转链接 */
  const loginRedirectUrl = computed(() => {
    let url = '';
    if (route.name === RouteNameMap.get('login')) {
      url = (route.query?.redirectUrl as string) ?? '';
    }
    return url;
  });

  return {
    loginRedirectUrl
  };
}
