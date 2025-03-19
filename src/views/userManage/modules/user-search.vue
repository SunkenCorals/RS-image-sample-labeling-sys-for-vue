<script setup lang="tsx">
import { defineEmits, ref } from 'vue';
import { NButton, NCard, NCollapse, NCollapseItem, NForm, NFormItemGi, NGrid, NInput, NSelect, NSpace } from 'naive-ui';

// ✅ 事件定义：触发 `search` 和 `reset`
const emit = defineEmits(['search', 'reset']);

// ✅ 搜索模型（v-model 绑定）
const searchParams = ref({
  userid: '', // 用户 ID
  username: '', // 用户名
  isadmin: undefined // 身份: 0 普通用户, 1 管理员
});

// ✅ 身份选项
const identityOptions = [
  { label: '普通用户', value: 0 },
  { label: '管理员', value: 1 }
];

// ✅ 触发搜索
const handleSearch = () => {
  emit('search', searchParams.value);
};

// ✅ 触发重置（清空所有输入框）
const handleReset = () => {
  searchParams.value = {
    userid: '',
    username: '',
    isadmin: undefined // 让下拉框也重置
  };
  emit('reset', searchParams.value);
};
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem title="搜索用户" name="user-search">
        <NForm :model="searchParams" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <!-- 用户 ID -->
            <NFormItemGi span="24 s:12 m:6" label="用户 ID" class="pr-24px">
              <NInput v-model:value="searchParams.userid" placeholder="请输入用户 ID" clearable />
            </NFormItemGi>

            <!-- 用户名 -->
            <NFormItemGi span="24 s:12 m:6" label="用户名" class="pr-24px">
              <NInput v-model:value="searchParams.username" placeholder="请输入用户名" clearable />
            </NFormItemGi>

            <!-- 用户类型 -->
            <NFormItemGi span="24 s:12 m:6" label="用户类型" class="pr-24px">
              <NSelect
                v-model:value="searchParams.isadmin"
                :options="identityOptions"
                placeholder="请选择用户类型"
                clearable
              />
            </NFormItemGi>

            <!-- 操作按钮 -->
            <NFormItemGi span="24 s:12 m:6" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="handleReset">重置</NButton>
                <NButton type="primary" ghost @click="handleSearch">搜索</NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
