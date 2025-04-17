<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NCard, NForm, NFormItemGi, NInput, NSelect } from 'naive-ui';
import { $t } from '@/locales';

interface TaskInfo {
  taskName: string;
  taskType: string;
  markGeoJsonArr?: any[];
  [key: string]: any;
}

const props = defineProps<{
  taskInfo: TaskInfo[];
}>();

const currentTaskInfo = ref<TaskInfo>({
  taskName: '',
  taskType: ''
});

watch(
  () => props.taskInfo,
  newVal => {
    if (newVal && newVal.length > 0) {
      currentTaskInfo.value = newVal[0];
    }
  },
  { immediate: true, deep: true }
);

const trainTimes = '';

const inferInfo = {
  minimumObjectSize: '',
  maximumHoleSize: '',
  smoothBoundaryDegree: '',
  modeFilterRange: ''
};
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm label-placement="left" :label-width="80">
      <NGrid cols="12" responsive="screen" item-responsive class="form-row" justify="end">
        <NFormItemGi span="2" :label="$t('page.common.taskName')" class="pr-24px" path="taskName">
          ：{{ currentTaskInfo?.taskname || '-' }}
        </NFormItemGi>

        <NFormItemGi span="2" :label="$t('page.common.taskType')" class="pr-24px">
          ：{{ currentTaskInfo?.type || '-' }}
        </NFormItemGi>

        <NFormItemGi span="2" label="当前图层:">
          <NSelect value="无" placeholder="请选择图层" clearable />
        </NFormItemGi>

        <NFormItemGi span="2" label="标注:">
          <NSelect placeholder="请选择" clearable />
        </NFormItemGi>

        <NFormItemGi span="4" class="button-group">
          <div class="button-container">
            <NButton type="error" class="button">删除</NButton>
            <NButton type="primary" class="button">返回</NButton>
            <NButton type="primary" class="button">前进</NButton>
            <NButton type="primary" class="button">保存</NButton>
            <NButton type="primary" class="button">更新样本</NButton>
          </div>
        </NFormItemGi>
        <!-- 模型训练 -->
        <NFormItemGi span="4" label="模型选择:">
          <div class="model-training-container">
            <NSelect placeholder="请选择模型" clearable class="model-select" />
            <NInput v-model:value="trainTimes" type="text" placeholder="训练次数" class="model-input" />
            <NButton type="primary" class="button">调用辅助</NButton>
          </div>
        </NFormItemGi>

        <!-- 模型推理 -->
        <NFormItemGi span="8" label="推理模型:">
          <div class="model-inference-container">
            <NSelect placeholder="请选择模型" clearable class="model-select" />
            <NInput
              v-model:value="inferInfo.minimumObjectSize"
              type="text"
              placeholder="最小物体大小"
              class="model-input"
            />
            <NInput
              v-model:value="inferInfo.maximumHoleSize"
              type="text"
              placeholder="最大孔洞大小"
              class="model-input"
            />
            <NInput
              v-model:value="inferInfo.smoothBoundaryDegree"
              type="text"
              placeholder="边界平滑程度"
              class="model-input"
            />
            <NInput
              v-model:value="inferInfo.modeFilterRange"
              type="text"
              placeholder="众数滤波范围"
              class="model-input"
            />
            <NButton type="primary" class="button">模型推理</NButton>
          </div>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped>
.card-wrapper {
  background-color: rgba(200, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 110px;
}

.card-wrapper :deep(.n-card__content) {
  padding: 8px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.button {
  min-width: 60px;
  height: 26px;
  font-size: 14px;
  border-radius: 4px;
  padding: 0 8px;
}

.model-training-container {
  display: flex;
  gap: 20px;
  align-items: center;
}

.model-select {
  flex: 1;
}

.model-input {
  flex: 0.8;
}

.model-inference-container {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.pr-24px {
  font-size: 14px;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: center;
}
</style>
