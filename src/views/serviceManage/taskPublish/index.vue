<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import TaskMessage from './modoles/taskMessage.vue';
import UpTaskData from './modoles/upTaskData.vue';

const taskMessageRef = ref();
const message = useMessage();

const handlePublish = async () => {
  try {
    await taskMessageRef.value.validate();
    // If validation passes, proceed with publishing
    message.success('任务发布成功');
  } catch {
    message.error('请填写必填项');
  }
};
</script>

<template>
  <div>
    <TaskMessage ref="taskMessageRef" />
    <UpTaskData @publish="handlePublish" />
  </div>
</template>

<style></style>
