<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>

<template>
  <NCard>
    <NUpload multiple directory-dnd action="https://httpbin.org/post" :max="100">
      <NUploadDragger>
        <NGrid cols="1" justify="center" align="center">
          <NGridItem>
            <Icon icon="streamline:upload-box-1-solid" style="font-size: 32px" />
          </NGridItem>
          <NGridItem>
            <NText style="font-size: 16px">点击或者拖动文件到该区域来上传</NText>
          </NGridItem>
        </NGrid>
      </NUploadDragger>
    </NUpload>
  </NCard>
</template>

<style scoped></style>
