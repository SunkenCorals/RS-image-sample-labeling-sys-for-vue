<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NSelect } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { Icon } from '@iconify/vue';

interface FileItem {
  name: string;
  file: UploadFileInfo;
  assignedUser: string | null;
}

const fileList = ref<FileItem[]>([]);
const users = ref([
  { label: '用户1', value: 'user1' },
  { label: '用户2', value: 'user2' },
  { label: '用户3', value: 'user3' }
]);

const handleFileChange = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileList.value = data.fileList.map(file => ({
    name: file.name,
    file,
    assignedUser: null
  }));
};

const handleUserChange = (value: string, index: number) => {
  fileList.value[index].assignedUser = value;
};

const emit = defineEmits<{
  (e: 'publish'): void;
}>();

const handlePublishTask = () => {
  emit('publish');
};
</script>

<template>
  <NCard>
    <NUpload multiple directory-dnd action="https://httpbin.org/post" :max="100" @change="handleFileChange">
      <NUploadDragger>
        <NGrid cols="1" justify="center" align="center">
          <NGridItem>
            <Icon icon="streamline:upload-box-1-solid" class="upload-icon" />
          </NGridItem>
          <NGridItem>
            <NText class="upload-text">点击或者拖动文件到该区域来上传</NText>
          </NGridItem>
        </NGrid>
      </NUploadDragger>
    </NUpload>

    <div class="file-list">
      <NCard v-for="(file, index) in fileList" :key="index" class="file-item">
        <NGrid cols="12" align="center">
          <NGridItem :span="9">
            <NText>{{ file.name }}</NText>
          </NGridItem>
          <NGridItem :span="3">
            <NSelect
              v-model:value="file.assignedUser"
              :options="users"
              placeholder="选择分配用户"
              @update:value="value => handleUserChange(value, index)"
            />
          </NGridItem>
        </NGrid>
      </NCard>
    </div>

    <div class="publish-button">
      <NButton type="primary" @click="handlePublishTask">发布任务</NButton>
    </div>
  </NCard>
</template>

<style scoped>
.file-list {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  margin-bottom: 5px;
}

.upload-icon {
  font-size: 32px;
}

.upload-text {
  font-size: 16px;
}

.publish-button {
  text-align: right;
  margin-top: 20px;
}
</style>
