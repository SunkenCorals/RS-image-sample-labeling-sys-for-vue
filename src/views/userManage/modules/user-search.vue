<script setup lang="tsx">
import { computed, defineEmits, ref } from 'vue';
import { NButton, NCard, NCollapse, NCollapseItem, NForm, NFormItemGi, NGrid, NInput, NSelect, NSpace } from 'naive-ui';
import { $t } from '@/locales';

// ✅ 事件定义：触发 `search` 和 `reset`
const emit = defineEmits(['search', 'reset']);

// ✅ 搜索模型（v-model 绑定）
const searchParams = ref({
  userid: '', // 用户 ID
  username: '', // 用户名
  isadmin: undefined // 身份: 0 普通用户, 1 管理员
});

// ✅ 身份选项
const identityOptions = computed(() => [
  { label: $t('page.usermanage.userIdentity.ordinaryUser'), value: 0 },
  { label: $t('page.usermanage.userIdentity.admin'), value: 1 }
]);

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
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm :model="searchParams" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <!-- 用户 ID -->
            <NFormItemGi span="24 s:12 m:6" label="ID" class="pr-24px">
              <NInput
                v-model:value="searchParams.userid"
                :placeholder="$t('page.usermanage.common.searchPlaceholder')"
                clearable
              />
            </NFormItemGi>

            <!-- 用户名 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.usermanage.common.username')" class="pr-24px">
              <NInput
                v-model:value="searchParams.username"
                :placeholder="$t('page.usermanage.common.searchPlaceholder')"
                clearable
              />
            </NFormItemGi>

            <!-- 用户类型 -->
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.usermanage.common.userIdentity')" class="pr-24px">
              <NSelect
                v-model:value="searchParams.isadmin"
                :options="identityOptions"
                :placeholder="$t('page.usermanage.common.searchPlaceholder')"
                clearable
              />
            </NFormItemGi>

            <!-- 操作按钮 -->
            <NFormItemGi span="24 s:12 m:6" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="handleReset">{{ $t('common.reset') }}</NButton>
                <NButton type="primary" ghost @click="handleSearch">{{ $t('common.search') }}</NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
