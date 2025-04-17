import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { boundingExtent } from 'ol/extent';
import { TileWMS } from 'ol/source';
import { Tile } from 'ol/layer';
// import { reqGetCategoryList } from '@/service/api/category';
import { reqGetGeoServerInfo } from '@/service/api/serviceManage';
import { reqStartMark } from '@/service/api/task';
import { Decrypt } from '@/utils/utils';

interface MapExtent {
  maxx: number;
  maxy: number;
  minx: number;
  miny: number;
}

interface TaskData {
  taskname: string;
  mapserver?: string;
}

interface TaskInfo {
  data: TaskData[];
  markGeoJsonArr?: any[];
}

interface GeoServerResponse {
  coverage?: {
    nativeBoundingBox: {
      maxx: number;
      maxy: number;
      minx: number;
      miny: number;
    };
  };
}

export function useMap() {
  const mapRef = ref<any>(null);
  const typeList = ref({});
  const taskInfo = ref<TaskInfo>({ data: [{ taskname: '无' }] });
  const markGeoJsonArr = ref<any[]>([]);
  const mapExtent = ref<MapExtent | null>(null);

  const setMap = (map: any) => {
    mapRef.value = map;
  };

  onMounted(async () => {
    let mapserver: string = '';
    let baseLayer: any;
    let zuoshangExtent: number[] = [];
    let youxiaExtent: number[] = [];

    const TASKID = window.sessionStorage.getItem('taskId');
    const taskId = Decrypt(TASKID);
    const hide = message.loading('正在获取数据', 0);

    const taskResult = await reqStartMark({ taskid: taskId });
    if (taskResult && taskResult.data) {
      taskInfo.value = taskResult.data;
      mapserver = taskResult.data[0].mapserver;
      markGeoJsonArr.value = taskResult.data.markGeoJsonArr || [];
    }

    if (mapserver) {
      const {
        response: { data }
      } = await reqGetGeoServerInfo(mapserver);
      const geoResult = data as GeoServerResponse;

      if (geoResult && geoResult.coverage) {
        mapExtent.value = geoResult.coverage.nativeBoundingBox;
      }
    }
    hide();

    if (mapserver) {
      try {
        const wmsSource = new TileWMS({
          url: 'http://localhost:8080/geoserver/LUU/wms',
          params: {
            FORMAT: 'image/png',
            VERSION: '1.1.1',
            LAYERS: `LUU:${mapserver}`,
            exceptions: 'application/vnd.ogc.se_inimage',
            SERVICE: 'WMS'
          },
          crossOrigin: 'anonymous'
        });

        baseLayer = new Tile({
          source: wmsSource
        });
        (baseLayer as any).set('title', '任务切片');

        if (mapExtent.value) {
          const { maxx, maxy, minx, miny } = mapExtent.value;
          zuoshangExtent = [Math.abs(minx), Math.abs(maxy)];
          youxiaExtent = [Math.abs(maxx), Math.abs(miny)];
          console.log('Extent coordinates:', { zuoshangExtent, youxiaExtent });
        }
      } catch (error) {
        console.error('Error creating WMS layer:', error);
        message.error('创建地图图层失败，请检查GeoServer配置');
      }
    }
    if (baseLayer && mapRef.value && zuoshangExtent.length > 0 && youxiaExtent.length > 0) {
      mapRef.value.addLayer(baseLayer);
      const displayRange = boundingExtent([zuoshangExtent, youxiaExtent]);
      console.log('Display range:', displayRange);

      const view = mapRef.value.getView();
      view.fit(displayRange, {
        maxZoom: 22,
        duration: 600,
        callback: () => {
          view.animate({ zoom: view.getZoom() - 1 });
        }
      });
    }
  });

  return {
    typeList,
    taskInfo,
    setMap,
    mapRef,
    markGeoJsonArr,
    mapExtent
  };
}
