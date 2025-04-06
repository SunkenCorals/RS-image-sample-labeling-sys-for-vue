<script setup lang="ts">
import { computed, ref } from 'vue';
import { NCard, NForm, NFormItemGi, NInput, NSelect } from 'naive-ui';
import { $t } from '@/locales';

const taskMessage = ref({
  taskName: '',
  taskType: '',
  taskDetail: ''
});

const taskType = computed(() => [
  { label: $t('page.common.terrainClassification'), value: 0 },
  { label: $t('page.common.targetDetection'), value: 1 }
]);
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm :model="taskMessage" label-placement="left" :label-width="80">
      <NGrid cols="12" responsive="screen" item-responsive>
        <!-- 任务名称-->
        <NFormItemGi span="4" :label="$t('page.common.taskName')" class="pr-24px">
          <NInput
            v-model:value="taskMessage.taskName"
            :placeholder="$t('page.usermanage.common.searchPlaceholder')"
            clearable
          />
        </NFormItemGi>

        <!-- 任务类型 -->
        <NFormItemGi span="4" :label="$t('page.common.taskType')" class="pr-24px">
          <NSelect
            v-model:value="taskMessage.taskType"
            :options="taskType"
            :placeholder="$t('page.usermanage.common.searchPlaceholder')"
            clearable
          />
        </NFormItemGi>

        <!-- 任务详情 -->
        <NFormItemGi span="4" :label="$t('page.common.taskDetail')" class="pr-24px">
          <NInput
            v-model:value="taskMessage.taskDetail"
            type="textarea"
            rows="4"
            :placeholder="$t('page.usermanage.common.searchPlaceholder')"
            clearable
          />
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
