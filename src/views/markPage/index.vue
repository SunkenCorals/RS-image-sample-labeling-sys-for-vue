<script lang="ts" setup>
import { useMap } from '@/hooks/map/useMap';
import MapBase from '@/views/markPage/modules/mapBase.vue';
import PerationMap from '@/views/markPage/modules/perationMap.vue';

// 定义 setMap 方法 typeList, , setMap, mapRef, markGeoJsonArr, mapExtent
const { setMap, taskInfo } = useMap();
</script>

<template>
  <div class="mark-page">
    <PerationMap :task-info="taskInfo" />
    <MapBase :set-map="setMap" />
  </div>
</template>

<style scoped>
.mark-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
