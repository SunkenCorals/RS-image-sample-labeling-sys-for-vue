import { request } from '../request';

export async function reqGetCategoryList(params: any = {}) {
  return request({
    url: '/wegismarkapi/type/getTypePage',
    method: 'GET',
    params: { ...params }
  });
}
