import { createApp } from 'vue';
import './plugins/assets';
import { useUserStore } from '@/store/modules/auth';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  // 浏览器全局调试store
  const authStore = useUserStore();
  (window as any).authStore = authStore;
  app.mount('#app');
}

setupApp();
