<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NDataTable, NPopconfirm, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useUserStore } from '@/store/modules/auth';
import UserSearch from '@/views/userManage/modules/user-search.vue';

//  获取用户 Store
const userStore = useUserStore();
const message = useMessage();

//  定义表格数据和加载状态
const tableData = ref<{ userid: number; username: string; isadmin: number }[]>([]);
const total = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// ✅ 默认 `isadmin` 必填，`userid` 和 `username` 可选
const searchParams = ref({ userid: '', username: '', isadmin: 1 });

//  获取用户数据
const fetchData = async () => {
  loading.value = true;

  // ✅ 组装请求参数，只带有值的字段
  const params: Record<string, any> = {
    isAdmin: searchParams.value.isadmin // `isadmin` 必须传递
  };

  if (searchParams.value.userid) params.userid = searchParams.value.userid;
  if (searchParams.value.username) params.username = searchParams.value.username;

  try {
    const response = await userStore.getUserList({
      current: currentPage.value,
      pageSize: pageSize.value,
      ...params // ✅ 只传递非空字段
    });

    // 解析数据
    if (response.data) {
      tableData.value = response.data || [];
      total.value = response.total || 0;
      message.success('数据加载成功');
    } else {
      message.error('获取用户列表失败');
    }
  } catch (error) {
    console.error('❌ 获取用户列表出错:', error);
    message.error('获取用户列表出错');
  } finally {
    loading.value = false;
  }
};

//  组件加载时获取数据
onMounted(() => {
  fetchData();
});

//  处理搜索
const handleSearch = (params: { userid?: string; username?: string; isadmin: number }) => {
  searchParams.value = params;
  fetchData();
};

//  处理重置
const handleReset = () => {
  searchParams.value = { userid: '', username: '', isadmin: 1 };
  fetchData();
};

//  处理用户编辑
const editUser = (row: { userid: number; username: string; isadmin: number }) => {
  console.log('编辑用户:', row);
  message.info(`编辑用户: ${row.username}`);
};

//  处理用户删除
const deleteUser = async (user_id: number) => {
  try {
    // 调用后端删除接口
    await userStore.deleteUser(user_id);

    // 显示删除成功消息
    message.success(`用户 ${user_id} 删除成功`);

    // 重新获取用户列表，确保页面数据更新
    await fetchData();
  } catch (error) {
    // 处理删除失败情况
    console.error('❌ 删除用户失败:', error);
    message.error(`删除用户失败: ${error}`);
  }
};

//  定义表格列
const columns: DataTableColumns<{ userid: number; username: string; isadmin: number }> = [
  { type: 'selection', align: 'center', width: 48 },
  { key: 'userid', title: '用户ID', align: 'center', width: 60 },
  { key: 'username', title: '用户名', align: 'center', minWidth: 120 },
  {
    key: 'isadmin',
    title: '用户类型',
    align: 'center',
    width: 150,
    render: row => (
      <NTag type={row.isadmin === 1 ? 'success' : 'warning'}>{row.isadmin === 1 ? '管理员' : '普通用户'}</NTag>
    )
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 130,
    render: row => (
      <div class="flex-center gap-8px">
        <NButton type="primary" ghost size="small" onClick={() => editUser(row)}>
          编辑
        </NButton>
        <NPopconfirm onPositiveClick={() => deleteUser(row.userid)}>
          {{
            default: () => '确认删除？',
            trigger: () => (
              <NButton type="error" ghost size="small">
                删除
              </NButton>
            )
          }}
        </NPopconfirm>
      </div>
    )
  }
];

//  处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};
</script>

<template>
  <div class="min-h-screen flex flex-col gap-4">
    <UserSearch @search="handleSearch" @reset="handleReset" />

    <NCard title="用户管理" :bordered="false" size="small">
      <template #header-extra>
        <NButton type="primary" @click="fetchData">刷新数据</NButton>
      </template>

      <!-- 让表格撑开页面，而不是自己滚动 -->
      <NDataTable
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="{
          pageSize: pageSize,
          itemCount: total,
          showSizePicker: false,
          onUpdatePage: handlePageChange
        }"
        :scroll-x="600"
        :row-key="row => row.userid"
        size="small"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
