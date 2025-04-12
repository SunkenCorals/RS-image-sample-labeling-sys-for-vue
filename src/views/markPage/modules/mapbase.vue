<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { notification } from 'antd';
import { Map, View } from 'ol';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
// import ScaleLine from 'ol/control/ScaleLine';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import 'ol/ol.css';
import LayerSwitcher from 'ol-layerswitcher';

// 定义 props
const props = defineProps<{
  setMap: (map: Map) => void;
}>();

const mapRef = ref<HTMLElement | null>(null);

// 明确指定 placement 的类型
const openNotification = (placement: any) => {
  notification.open({
    message: '温馨提示',
    description: '服务瓦片可能加载较慢，请耐心等待!',
    placement
  });
};

const initMap = () => {
  try {
    if (!mapRef.value) {
      console.error('地图容器元素未找到，请检查 DOM 结构。');
      return;
    }
    const tianDiRSLayer = new TileLayer({
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=2ab0481b80f9e234df6fa67b414e7500'
      })
    });
    (tianDiRSLayer as any).set('title', '天地图影像图');

    const OSMLayer = new TileLayer({
      source: new OSM({
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    });
    (OSMLayer as any).set('title', 'OSM资源图');

    const map = new Map({
      view: new View({
        center: transform([114.298572, 30.584355], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6,
        minZoom: 2,
        maxZoom: 20
      }),
      layers: [tianDiRSLayer, OSMLayer],
      target: mapRef.value
    });

    // const scaleLineControl = new ScaleLine({
    //   units: 'metric',
    //   className: 'ol-scale-line',
    // });

    // 添加自定义类名
    const layerSwitcher = new LayerSwitcher({
      activationMode: 'mouseover'
    });

    map.addControl(layerSwitcher);
    // map.addControl(scaleLineControl);

    props.setMap(map);
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};
onMounted(() => {
  // 传入合法的值
  openNotification('topLeft');
  initMap();
});
</script>

<template>
  <div id="map-container" ref="mapRef" class="map-container"></div>
</template>

<style scoped>
.map-container {
  height: 100%;
  color: black;
}
</style>
