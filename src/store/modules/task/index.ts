import { defineStore } from 'pinia';
import { fetchTaskList } from '@/service/api/task';

export const useTaskStore = defineStore('task', {
  actions: {
    async getTaskList(params = {}) {
      try {
        const { data } = await fetchTaskList(params);
        return data;
      } catch (error) {
        console.error('失败:', error);
        return { error: '获取任务列表失败', details: error };
      }
    }
  }
});
