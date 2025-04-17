<script lang="ts" setup>
import { useMap } from '@/hooks/map/useMap';
import MapBase from '@/views/markPage/modules/mapBase.vue';
import PerationMap from '@/views/markPage/modules/perationMap.vue';

// 定义 setMap 方法 typeList, taskInfo, setMap, mapRef, markGeoJsonArr, mapExtent
const { setMap } = useMap();
</script>

<template>
  <PerationMap />
  <MapBase :set-map="setMap" />
</template>

<style scoped></style>
