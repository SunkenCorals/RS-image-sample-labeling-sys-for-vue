import { request } from '../request';

export function fetchTaskList(params = {}) {
  return request({
    url: '/wegismarkapi/task/getTaskInfo',
    method: 'GET',
    params
  });
}

// 开始标注请求标注地图服务地图
export async function reqStartMark(params = {}) {
  return request({
    url: `/wegismarkapi/task/getTaskInfo`,
    method: 'GET',
    params,
    timeout: 6000
  });
}
