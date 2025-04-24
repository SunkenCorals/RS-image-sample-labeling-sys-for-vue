<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { NButton, NCard, NForm, NFormItemGi, NInput, NSelect } from 'naive-ui';
import { message } from 'ant-design-vue';
import VectorSource from 'ol/source/Vector';
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import Collection from 'ol/Collection';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Select } from 'ol/interaction';
import { useMap } from '@/hooks/map/useMap';
import MapBase from '@/views/markPage/modules/mapBase.vue';
import { $t } from '@/locales';

interface ToolbarState {
  drawState: boolean;
  color: string;
  sourceKey: string | null;
  markSource: VectorSource<Feature<Geometry>>;
  currentLayer: VectorLayer<VectorSource> | null;
}

const shapeSelect = ref();
const layerSelect = ref();
// const showUploader = ref(false);
// const showAuditLoader = ref(false);
// const markSource = ref(new VectorSource());
// const auditFeedback = ref('');
const toolbarState = ref<ToolbarState>({
  drawState: true,
  color: '',
  sourceKey: null,
  markSource: new VectorSource(),
  currentLayer: null
});

const { setMap, mapRef, taskInfo, markGeoJsonArr, typeList } = useMap();
// 控制组件收起状态
const isCollapsed = ref(true);

const drawOptions = [
  { label: '矩形', value: 'Box' },
  { label: '正方形', value: 'Square' },
  { label: '多边形', value: 'Polygon' }
];

let shapeDraw: Draw;
let select: Select;
const featuresList = ref<Feature<Geometry>[]>([]);

const trainTimes = ref('');
const currentUser = ref('admin');

const inferInfo = {
  minimumObjectSize: '',
  maximumHoleSize: '',
  smoothBoundaryDegree: '',
  modeFilterRange: ''
};

// 遍历生成不同目标图层
const generateMarkLayer = computed(() => {
  // 收集所有标签信息，用于渲染其他用户标注的图层
  const currentUserTagList = taskInfo.value[0].userArr;
  const totalTypeIdArr = [];
  if (currentUserTagList) {
    for (const { typeArr, username } of currentUserTagList) {
      // 开始审理的管理员可以看到所有同一任务下的所有用户的标记
      if (currentUser.value === 'admin') {
        totalTypeIdArr.push(...typeArr);
      }
      // 非管理员只能看到自己的标记
      else if (username === currentUser.value) {
        totalTypeIdArr.push(...typeArr);
      }
    }
  }
  console.log('totalTypeIdArr.length', totalTypeIdArr.length);
  let vectorLayerArr: VectorLayer<VectorSource>[] = [];
  if (totalTypeIdArr.length) {
    // 只对当前用户生成标注图形
    vectorLayerArr = totalTypeIdArr.map(({ typeColor, typeName, typeId }) => {
      const typeSource = new VectorSource({
        format: new GeoJSON({
          // dataProjection: 'EPSG:3de57'
        })
      });
      typeSource.set('typeid', typeId);
      console.log(' markGeoJsonArr.value', markGeoJsonArr.value);
      for (const item of markGeoJsonArr.value) {
        if (typeId === item.typeId) {
          console.log('进入const item of markGeoJsonArr', item.markGeoJson);
          const existedFeatures = new GeoJSON().readFeatures(item.markGeoJson);
          const map = existedFeatures.map(existedFeaturesItem => {
            existedFeaturesItem.set('markId', item.markId);
            return existedFeaturesItem;
          });
          typeSource.addFeatures(map);
        }
      }
      const vectorLayer = new VectorLayer({
        source: typeSource,
        style: new Style({
          // 填充
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          // 边框
          stroke: new Stroke({
            color: typeColor,
            // color: '#6699ff',
            width: 3
          })
        })
      });
      vectorLayer.set('title', typeName);
      vectorLayer.set('typeid', typeId);
      return vectorLayer;
    });
  }
  return vectorLayerArr;
});

// 获取当前标注的数据源
const currentSource = (typeid: string) => {
  for (const layer of generateMarkLayer.value) {
    if (layer.getSource()?.get('typeid') === typeid) {
      console.log('获取当前标注的数据源layer.getSource()', layer.getSource());
      return layer.getSource();
    }
  }
  return null;
};

// 获取当前标注的图层
const currentLayer = (typeid: string) => {
  for (const layer of generateMarkLayer.value) {
    if (layer.get('typeid') === typeid) {
      console.log('获取当前标注的图层layer', layer);
      // 添加绘制的交互
      select = new Select({
        layers: [layer]
      });
      const translate = new Translate({
        features: layer.getSource()?.getFeaturesCollection() || new Collection()
      });
      mapRef.value?.addInteraction(translate);
      mapRef.value?.addInteraction(select);
      return layer;
    }
  }
  return null;
};

// 获取当前用户的标签方案选项
const getLayerOptions = () => {
  if (taskInfo.value.length === 0) return [];
  const typeArr = taskInfo.value[0].userArr[0].typeArr;
  return [
    ...typeArr.map((type: any) => ({
      label: type.typeName,
      value: type.typeId
    }))
  ];
};

// 定义一个函数用于移除地图中的所有 Draw 交互
const removeAllDrawInteractions = () => {
  const interactions = mapRef.value.getInteractions().getArray();
  interactions.forEach((interaction: any) => {
    if (interaction instanceof Draw) {
      mapRef.value.removeInteraction(interaction);
    }
  });
};

// 添加绘制交互
const addDrawInteraction = () => {
  // 移除地图中所有的 Draw 交互
  removeAllDrawInteractions();
  let value = shapeSelect.value;
  let geometryFunction;
  switch (value) {
    // 正方形
    case 'Square':
      value = 'Circle';
      geometryFunction = createRegularPolygon(4);
      break;
    // 矩形
    case 'Box':
      value = 'Circle';
      geometryFunction = createBox();
      break;
    // 多边形
    case 'Polygon':
      value = 'Polygon';
      break;
    default:
      value = 'Circle';
      geometryFunction = createBox();
      break;
  }

  shapeDraw = new Draw({
    source: toolbarState.value.markSource as VectorSource<Feature<Geometry>>,
    type: value as any,
    geometryFunction
  });

  shapeDraw.on('drawend', event => {
    const geometry = event.feature.getGeometry();
    if (geometry) {
      geometry.getExtent();
      mapRef.value.getView().getResolution();
    }
  });
  mapRef.value.addInteraction(shapeDraw);
};

const onSelect = () => {
  // 移除所有的 Draw 交互
  removeAllDrawInteractions();
  // 只有当选择了形状时才添加绘制交互
  if (shapeSelect.value) {
    addDrawInteraction();
  }
};

// 按下esc取消绘制
document.onkeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    shapeSelect.value = '';
    onSelect();
  }
};

// 选择编辑图层
const onLayerSelect = () => {
  const key = layerSelect.value;
  if (key !== '') {
    const type = typeList.value.filter(item => item.typeId === key);
    if (type.length > 0) {
      console.log('给toolbarState赋值');
      toolbarState.value = {
        color: type[0].typeColor || '',
        drawState: false,
        sourceKey: key,
        markSource: currentSource(key) as VectorSource<Feature<Geometry>>,
        currentLayer: currentLayer(key) as VectorLayer<VectorSource>
      };
      const modify = new Modify({
        source: toolbarState.value.markSource as VectorSource<Feature<Geometry>>
      });
      mapRef.value?.addInteraction(modify);
    }
  } else {
    toolbarState.value = {
      color: '',
      drawState: true,
      sourceKey: null,
      markSource: new VectorSource(),
      currentLayer: null
    };
  }
};

// 删除要素函数
const deleteFeature = () => {
  const selectFeasuresList = select.getFeatures().getArray();
  if (selectFeasuresList.length > 0 && toolbarState.value.currentLayer) {
    try {
      selectFeasuresList.forEach(item => {
        toolbarState.value.currentLayer!.getSource()!.removeFeature(item);
      });
    } catch (error) {
      console.log(error);
      message.error('标注未完成！');
    }
  } else {
    message.warn('未标注或未选中图形！');
  }
  select.getFeatures().clear();
};

// 回滚函数
const undo = () => {
  try {
    if (!toolbarState.value.currentLayer!.getSource()) {
      message.warn('请选择图层');
      return;
    }
    const features = toolbarState.value.currentLayer!.getSource()!.getFeatures();
    const feature = features.pop();
    if (feature) {
      toolbarState.value.currentLayer!.getSource()!.removeFeature(feature);
      featuresList.value.push(feature);
    }
  } catch (error) {
    console.log(error);
    message.warn('请选择图层');
  }
};

// // 回滚
// const undo = () => {
//   try {
//     const features = toolbarState.value.currentLayer.getSource().getFeatures();
//     const feature = features.pop();
//     if (feature) {
//       toolbarState.value.currentLayer.getSource().removeFeature(feature);
//       featuresList.value.push(feature);
//     }
//   } catch (error) {
//     console.log(error);
//     message.warning('请选择图层');
//   }
// };
//
// // 恢复
// const recover = () => {
//   const feature = featuresList.value.pop();
//   if (feature) {
//     toolbarState.value.currentLayer.getSource()?.addFeature(feature);
//   }
// };
//
// const getTaskId = computed(() => {
//   const TASKID = window.sessionStorage.getItem('taskId');
//   return Decrypt(TASKID);
// });

// // 保存标注
// const save = async () => {
//   const taskId = getTaskId.value;
//   const jsondataArr = [];
//   for (const layer of generateMarkLayer.value) {
//     const features = layer.getSource().getFeatures();
//     const typeId = layer.getSource().get('typeid');
//     const extentArr = [];
//     if (features.length) {
//       for (const feature of features) {
//         extentArr.push({
//           feature: feature?.getGeometry().getCoordinates(),
//           markId: feature?.get('markId')
//         });
//       }
//     }
//     jsondataArr.push({ extentArr, typeId });
//   }
//   if (jsondataArr.length !== 0) {
//     try {
//       const hide = message.loading('正在保存');
//       const result = await reqSaveService({
//         userid: currentTaskInfo.value[0].userArr.filter(({ username }) => username === currentUser.value)[0].userid,
//         id: taskId,
//         jsondataArr,
//         typeArr: currentTaskInfo.value[0].userArr.filter(({ username }) => username === currentUser.value)[0].typeArr
//       });
//       if (result) {
//         hide();
//         message.success('保存成功！');
//       } else {
//         message.error('保存失败！');
//       }
//     } catch (error) {
//       console.log(error);
//       message.error('后台异常，请稍后重试！');
//     }
//   } else {
//     message.warning('不能保存空数据！');
//   }
// };

// // 删除要素
// const deleteFeature = () => {
//   const selectFeaturesList = select.getFeatures().getArray();
//   if (selectFeaturesList.length > 0) {
//     try {
//       selectFeaturesList.forEach((item: any) => {
//         toolbarState.value.currentLayer.getSource().removeFeature(item);
//       });
//     } catch (error) {
//       console.log(error);
//       message.error('标注未完成！');
//     }
//   } else {
//     message.warning('未标注或未选中图形！');
//   }
//   select.getFeatures().clear();
// };

// // 导出获得数据并发送请求
// const onExport = async (JsonObj) => {
//   const hide = message.loading('正在导出样本数据');
//   const data = { jsonData: JsonObj };
//   try {
//     reqExportService(data).then((res) => {
//       hide();
//       let link = document.createElement('a');
//       link.style.display = 'none';
//       link.target = '_blank';
//       link.href = URL.createObjectURL(res);
//       link.download = '标注数据.zip';
//       document.body.appendChild(link);
//       link.click();
//       URL.revokeObjectURL(link.href);
//       document.body.removeChild(link);
//     });
//   } catch (e) {
//     hide();
//     message.error('导出失败，请稍后重试！');
//     return false;
//   }
//   return true;
// };

// const handleGetShp = shp => {
//   // 直接转化成对象，加入地图，如下
//   const importJson = JSON.parse(shp);
//   markSource.value.addFeatures(new GeoJSON().readFeatures(importJson));
// };

// // 导出
// const exportFile = () => {
//   const features = toolbarState.value.currentLayer.getSource().getFeatures();
//   const jsonobj = new GeoJSON().writeFeatures(features);
//   if (JSON.parse(jsonobj).features.length > 0) {
//     onExport(JSON.parse(jsonobj));
//   } else {
//     message.warning('不能导出空的数据');
//   }
// };

// // 通过审核
// const passAudit = async () => {
//   const taskid = getTaskId.value;
//   try {
//     const hide = message.loading('正在提交');
//     const result = await reqAuditTask({ taskid, status: 1 });
//     if (result.code === 200) {
//       hide.destroy();
//       message.success('提交成功！');
//       router.push('/taskmanage');
//     } else {
//       message.error('提交失败！');
//     }
//   } catch (error) {
//     console.log(error);
//     message.error('后台异常，请稍后重试！');
//   }
// };

// const onCreate = async ({ auditfeedback }) => {
//   const taskid = getTaskId.value;
//   try {
//     const hide = message.loading('正在提交');
//     const result = await reqAuditTask({ taskid, status: 2, auditfeedback });
//     if (result.code === 200) {
//       hide.destroy();
//       message.success('提交成功！');
//       router.push('/taskmanage');
//     } else {
//       message.error('提交失败！');
//     }
//     showAuditLoader.value = false;
//   } catch (error) {
//     console.log(error);
//     message.error('后台异常，请稍后重试！');
//     showAuditLoader.value = false;
//   }
// };

// const onCancel = () => {
//   showAuditLoader.value = false;
// };
//
// const setShowUploader = (flag) => {
//   showUploader.value = flag;
// };

watch(mapRef, () => {
  // 遍历设定方案动态添加图层 用户标注此处不生效，审核时生效
  for (const vector of generateMarkLayer.value) {
    vector.setZIndex(99);
    mapRef.value.addLayer(vector);
  }
});

watch(layerSelect, () => {
  onLayerSelect();
});

watch(shapeSelect, () => {
  onSelect();
});
</script>

<template>
  <div v-if="taskInfo.length > 0" class="mark-page">
    <MapBase :set-map="setMap" />
    <div class="overlay-component" :class="{ collapsed: isCollapsed }">
      <NCard :bordered="false" size="small" class="card-wrapper">
        <NForm label-placement="left" :label-width="80">
          <NGrid cols="20">
            <NFormItemGi span="1" class="pr-24px">
              <NButton type="success" @click="isCollapsed = !isCollapsed">
                {{ isCollapsed ? '展开' : '收起' }}
              </NButton>
            </NFormItemGi>

            <NFormItemGi span="3" :label="$t('page.common.taskName')" class="pr-24px" path="taskName">
              {{ taskInfo[0].taskname || '-' }}
            </NFormItemGi>

            <NFormItemGi span="3" :label="$t('page.common.taskType')" class="pr-24px">
              {{ taskInfo[0].type || '-' }}
            </NFormItemGi>

            <NFormItemGi span="4" label="当前图层:">
              <NSelect v-model:value="layerSelect" :options="getLayerOptions()" placeholder="选择图层" />
            </NFormItemGi>

            <NFormItemGi span="4" label="标注形状:">
              <NSelect
                v-model:value="shapeSelect"
                :options="drawOptions"
                placeholder="选择标注形状"
                :disabled="toolbarState.drawState"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi span="5" class="button-group">
              <div class="button-container">
                <NButton type="error" class="button" @click="deleteFeature">删除</NButton>
                <NButton type="primary" class="button" @click="undo">返回</NButton>
                <NButton type="primary" class="button">前进</NButton>
                <NButton type="primary" class="button">保存</NButton>
                <NButton type="primary" class="button">更新</NButton>
              </div>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCard>
      <div v-if="!isCollapsed" class="content">
        <NCard :bordered="false" size="small" class="card-wrapper">
          <NForm label-placement="left" :label-width="80">
            <NGrid cols="12" responsive="screen" item-responsive class="form-row" justify="end">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.mark-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative; /* 设置为相对定位，作为 overlay-component 的定位参考 */
}

.overlay-component {
  position: absolute; /* 保持绝对定位 */
  top: 20px;
  left: 50%;
  transform: translateX(-50%); /* 将组件向左移动自身宽度的 50%，实现水平居中 */
  width: 90%; /* 增大组件宽度，可根据需求调整 */
  right: auto; /* 确保右侧不溢出 */
  bottom: auto; /* 确保底部不溢出 */
  max-width: calc(100% - 40px); /* 限制最大宽度，避免水平溢出 */
  max-height: calc(100% - 40px); /* 限制最大高度，避免垂直溢出 */
  background-color: rgba(255, 255, 255, 0.7); /* 半透明背景 */
  padding: 10px;
  border-radius: 5px;
  z-index: 100;
  transition: all 0.3s ease;
  overflow: auto; /* 当内容超出时显示滚动条 */
}

/* 其他样式保持不变 */
.overlay-component.collapsed .content {
  display: none;
}

.content {
  margin-top: 10px;
}

.text-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.card-wrapper {
  background-color: rgba(200, 255, 255, 0.01);
  height: 50px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  min-width: 45px;
  height: 25px;
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
