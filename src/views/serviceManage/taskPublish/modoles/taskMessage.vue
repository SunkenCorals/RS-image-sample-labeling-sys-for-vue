<script setup lang="ts">
import { computed, ref } from 'vue';
import { NCard, NForm, NFormItemGi, NInput, NSelect } from 'naive-ui';
import { $t } from '@/locales';

const taskMessage = ref({
  taskName: '',
  taskType: null,
  taskDetail: '',
  taskDeadline: undefined
});

const taskType = computed(() => [
  { label: $t('page.common.terrainClassification'), value: '0' },
  { label: $t('page.common.targetDetection'), value: '1' }
]);

const formRef = ref();

const rules = {
  taskName: {
    required: true,
    message: '请输入任务名称',
    trigger: ['blur', 'input']
  },
  taskType: {
    required: true,
    message: '请选择任务类型',
    trigger: ['blur', 'change'],
    validator: (_rule: any, value: any) => {
      return value !== null && value !== undefined;
    }
  }
};

defineExpose({
  validate: () => formRef.value?.validate(),
  taskMessage
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="taskMessage" label-placement="left" :label-width="80" :rules="rules">
      <NGrid cols="12" responsive="screen" item-responsive>
        <!-- 任务名称-->
        <NFormItemGi span="4" :label="$t('page.common.taskName')" class="pr-24px" path="taskName" required>
          <NInput
            v-model:value="taskMessage.taskName"
            :placeholder="$t('page.usermanage.common.searchPlaceholder')"
            clearable
          />
        </NFormItemGi>

        <!-- 任务类型 -->
        <NFormItemGi span="4" :label="$t('page.common.taskType')" class="pr-24px" path="taskType" required>
          <NSelect
            v-model:value="taskMessage.taskType"
            :options="taskType"
            :placeholder="$t('page.usermanage.common.searchPlaceholder')"
            clearable
          />
        </NFormItemGi>

        <!-- 选择时间-->
        <NFormItemGi span="4" :label="$t('page.common.taskDeadline')" class="pr-48px">
          <NDatePicker v-model:value="taskMessage.taskDeadline" type="datetime" clearable />
        </NFormItemGi>

        <!-- 任务详情 -->
        <NFormItemGi span="6" :label="$t('page.common.taskDetail')" class="pr-24px">
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
