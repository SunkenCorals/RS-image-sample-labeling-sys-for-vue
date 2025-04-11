import { request } from '../request';

export function fetchTaskList(params = {}) {
  return request({
    url: '/wegismarkapi/task/getTaskInfo',
    method: 'GET',
    params
  });
}
