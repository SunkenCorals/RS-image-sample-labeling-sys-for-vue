import { request } from '../request';

function parseResponse<T>(response: any): T {
  if (response && response.response?.data) {
    return response.response.data as T;
  }
  throw new Error('Invalid response format');
}

interface LoginParams {
  userName: string;
  userPassword: string;
}

interface _LoginResponse {
  token: string;
  userInfo: {
    id: string;
    userName: string;
    roles: string[];
    isAdmin: number;
  };
}

/** 用户登录 */
export function fetchLogin(data: LoginParams) {
  return request({
    url: '/wegismarkapi/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  });
}

/** 退出登录 */
export function fetchLogout() {
  return request({
    url: '/wegismarkapi/user/outLogin',
    method: 'POST'
  });
}

/** 获取当前用户信息 */
interface ApiResponse<T = any> {
  response?: {
    data?: T;
  };
}

export function fetchCurrentUser(): Promise<any | null> {
  return request({
    url: '/wegismarkapi/user/currentState',
    method: 'GET'
  })
    .then((response: ApiResponse) => {
      console.log('🚀 fetchCurrentUser 响应:', response);

      // 确保返回的是 response.response?.data，而不是 { data: response }
      return response.response?.data || {};
    })
    .catch((error: unknown) => {
      console.error('❌ fetchCurrentUser 请求失败:', error);
      return null;
    });
}
/** 用户注册 */
interface RegisterParams {
  userName: string;
  userPassword: string;
}

interface RegisterResponse {
  code: number;
  message: string;
}

export async function fetchRegister(data: RegisterParams): Promise<RegisterResponse> {
  try {
    const response = await request({
      url: '/wegismarkapi/user/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    });

    console.log('📢 注册 API 响应:', response); // 🔥 确保 `response` 结构正确

    const result: RegisterResponse | undefined = response.data || response.response?.data;

    if (result && typeof result.code === 'number' && typeof result.message === 'string') {
      return result; // ✅ 确保返回 `{ code, message }`
    }
    throw new Error('❌ API 响应数据格式错误');
  } catch (error) {
    console.error('❌ 注册请求失败:', error);
    throw new Error('注册请求失败，请稍后重试！');
  }
}
/** 重置用户密码 */
export function fetchResetPassword(userId: number) {
  return request({
    url: '/wegismarkapi/user/resetPassword',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: { userid: userId }
  });
}

/** 获取用户分页列表 */
// export function fetchUserList(params: {
//   userid?: number;
//   isAdmin?: number;
//   current?: number;
//   pageSize?: number;
//   username?: string;
// }) {
//   return request({
//     url: '/wegismarkapi/user/getUsers',
//     method: 'GET',
//     params
//   });
// }
interface UserListResponse {
  code: number;
  message: string;
  total: number;
  success: boolean;
  data: {
    userid: number;
    username: string;
    userpassword: string;
    isadmin: number;
    finishednum: number | null;
    unfinishednum: number | null;
  }[];
}
export function fetchUserList(params: { current?: number; pageSize?: number; isAdmin?: number }) {
  return request({
    url: '/wegismarkapi/user/getUsers',
    method: 'GET',
    params
  }).then(parseResponse<UserListResponse>);
}
/** 删除用户 */
export function fetchDeleteUser(user_id: number) {
  return request({
    url: `/wegismarkapi/user/deleteUser/${user_id}`,
    method: 'DELETE'
  });
}

/** 定义角色返回的接口 */
interface RoleResponse {
  code: number;
  message: string;
  data: {
    id: number;
    rolename: string;
    rolecode: number;
  }[];
}
/** 获取所有角色类型 */
export function fetchRoles(): Promise<RoleResponse> {
  return request({
    url: '/wegismarkapi/user/getRoles',
    method: 'GET'
  }).then(parseResponse<RoleResponse>); // ✅ 复用 `parseResponse<T>`
}

/** 更新用户信息 */
export function fetchUpdateUser(data: { userid: number; username: string; isadmin: number }) {
  return request({
    url: '/wegismarkapi/user/updateUser',
    method: 'PUT',
    data
  });
}
