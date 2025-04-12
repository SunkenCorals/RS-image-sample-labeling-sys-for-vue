<script lang="ts" setup>
import Mapbase from '@/views/markPage/modules/mapbase.vue';

// 定义 setMap 方法
const handleSetMap = (map: any) => {
  try {
    console.log('地图实例:', map);
    // 这里可以添加更多处理逻辑
  } catch (error) {
    console.error('处理地图实例时出错:', error);
  }
};
</script>

<template>
  <Mapbase :set-map="handleSetMap" />
</template>
