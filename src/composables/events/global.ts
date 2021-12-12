import { useAuthChangeEvent } from './auth';

export function useGlobalEvent() {
  /** 初始化全局监听事件 */
  function initGlobalListener() {
    useAuthChangeEvent();
  }

  return {
    initGlobalListener
  };
}
