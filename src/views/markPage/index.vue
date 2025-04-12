<script lang="ts" setup>
import { message } from 'antd';
import MapBase from '@/views/markPage/modules/mapBase.vue';
import PerationMap from '@/views/markPage/modules/perationMap.vue';

// 定义 setMap 方法
const handleSetMap = () => {
  try {
    message.success('地图加载成功');
    // 这里可以添加更多处理逻辑
  } catch (error) {
    message.error(error);
  }
};
</script>

<template>
  <PerationMap />
  <MapBase :set-map="handleSetMap" />
</template>
