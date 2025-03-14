import { defineStore } from 'pinia';
import {
  fetchCurrentUser,
  fetchDeleteUser,
  fetchLogin,
  fetchLogout,
  fetchRegister,
  fetchResetPassword,
  fetchRoles,
  fetchUpdateUser,
  fetchUserList
} from '@/service/api/auth';
import { localStg } from '@/utils/storage';
// const defaultUserInfo = {
//   userId: 'defaultUser',  // 默认用户ID
//   name: 'Default User',   // 默认用户名
//   roles: ['user'],        // 默认角色，可根据需要添加
//   // 其他需要的默认属性
// };
export const useUserStore = defineStore('user', {
  state: (): {
    token: string;
    userInfo: { id: string; userName: string; roles: string[]; isAdmin: number } | null;
    loginLoading: boolean;
    users: any[];
    roles: any[];
  } => ({
    token: localStg.get('token') || '',
    userInfo: localStg.get('userInfo') || { id: '', userName: '', roles: [], isAdmin: 0 },
    loginLoading: false,
    users: [],
    roles: []
  }),
  getters: {
    /** 判断是否是超级管理员 */
    isStaticSuper: state => {
      const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;
      return VITE_AUTH_ROUTE_MODE === 'static' && state.userInfo?.roles?.includes(VITE_STATIC_SUPER_ROLE);
    }
  },

  actions: {
    /** ✅ 用户注册 */
    async register(registerData: { userName: string; userPassword: string }) {
      try {
        const data = await fetchRegister(registerData); // ✅ 确保 `fetchRegister()` 返回 `data`
        console.log('📢 注册返回数据:', data); // 🔥 确保 `data` 正确

        if (data.code === 200) {
          return { success: true, message: data.message };
        }
        return { success: false, message: data.message || '注册失败' };
      } catch (error) {
        console.error('❌ 注册失败:', error);
        return { success: false, message: '注册失败，请稍后重试！' };
      }
    },
    /** 用户登录 */
    async login(loginRes: { userName: string; userPassword: string }) {
      try {
        const { data } = await fetchLogin(loginRes);
        console.log(data);
        // console.log(await fetchLogin(loginRes));
        if (data) {
          this.token = data.token;

          // 存储 Token & 用户信息
          localStg.set('token', data.token);
          // localStg.set('userInfo', data.userInfo);
          console.log('✅ 登录成功', data.token);
          // return { success: true, token: data.token };
        }
        throw new Error('登录失败，未返回 Token');
      } catch (error) {
        console.error('❌ 登录失败:', error);
        throw error;
      }
    },

    async initUserToken() {
      return localStg.get('token');
    },
    /** 获取当前用户信息 */
    async initUserInfo() {
      try {
        const data = await fetchCurrentUser(); // ✅ 现在 data 直接是 { currentUser: "hzh", isAdmin: 1 }
        console.log('📢 解析后的 data:', data);

        if (!data || !data.currentUser) {
          throw new Error('❌ API 返回的 `currentUser` 为空');
        }

        const userInfo = {
          id: '', // 没有 id，默认空字符串
          userName: data.currentUser, // ✅ 正确赋值
          roles: [], // 角色信息后端未返回，默认空数组
          isAdmin: data.isAdmin ?? 0 // 避免 undefined
        };

        this.userInfo = userInfo;
        localStg.set('userInfo', userInfo);
        console.log('✅ 存储的 userInfo:', this.userInfo);
      } catch (error) {
        console.error('❌ 获取当前用户信息失败:', error);
        await this.logout();
      }
    },
    /** 退出登录 */
    async logout() {
      try {
        await fetchLogout();
      } catch (error) {
        console.warn('⚠️ 退出登录失败:', error);
      }

      this.token = '';
      this.userInfo = null;
      localStg.remove('token');
      localStg.remove('userInfo');
    },

    /** **重置用户状态（清除 token & 用户信息）** */
    resetStore() {
      this.token = '';
      this.userInfo = null;
      localStg.remove('token');
      localStg.remove('userInfo');
    },
    /** 获取当前用户信息 */
    async checkAuth() {
      try {
        const { data } = await fetchCurrentUser();
        if (data) {
          this.userInfo = data;
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    },

    /** 获取用户列表 */
    async getUserList(params: { current?: number; pageSize?: number }) {
      try {
        const { data } = await fetchUserList(params);
        this.users = data?.data || [];
      } catch (error) {
        console.error('❌ 获取用户列表失败:', error);
      }
    },

    /** 删除用户 */
    async deleteUser(userId: number) {
      try {
        await fetchDeleteUser(userId);
        this.getUserList({});
      } catch (error) {
        console.error('❌ 删除用户失败:', error);
      }
    },

    /** 获取所有角色 */
    async getRoles() {
      try {
        const { data } = await fetchRoles();
        this.roles = data || [];
      } catch (error) {
        console.error('❌ 获取角色失败:', error);
      }
    },

    /** 更新用户信息 */
    async updateUser(data: { userid: number; username: string; isadmin: number }) {
      try {
        await fetchUpdateUser(data);
        this.getUserList({});
      } catch (error) {
        console.error('❌ 更新用户信息失败:', error);
      }
    },

    /** 重置密码 */
    async resetPassword(userId: number) {
      try {
        await fetchResetPassword(userId);
      } catch (error) {
        console.error('❌ 重置密码失败:', error);
      }
    }
  }
});
