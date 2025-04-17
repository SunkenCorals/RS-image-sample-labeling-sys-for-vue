import { request } from '../request';

export async function reqGetGeoServerInfo(name: string) {
  // Create base64 encoded auth string using browser's btoa function
  const authString = btoa('admin:geoserver');

  return request({
    url: `http://localhost:8080/geoserver/rest/workspaces/LUU/coveragestores/${name}/coverages/${name}.json`,
    method: 'get',
    headers: {
      Authorization: `Basic ${authString}`
    }
  });
}
