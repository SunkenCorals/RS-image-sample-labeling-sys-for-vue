<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, useMessage } from 'naive-ui';
import { $t } from '@/locales';

interface RowData {
  key: number;
  taskName: string;
  taskType: string;
  taskDetail: string;
  publishTime: string;
  deadline: string;
  completionRate: string;
}

export default defineComponent({
  setup() {
    const message = useMessage();
    const sendMail = (rowData: RowData) => {
      message.info($t('page.serviceManage.common.messages.startMark', { name: rowData.taskName }));
    };

    const columns = computed<DataTableColumns<RowData>>(() => {
      return [
        {
          title: $t('page.serviceManage.common.columns.taskName'),
          key: 'taskName'
        },
        {
          title: $t('page.serviceManage.common.columns.taskType'),
          key: 'taskType'
        },
        {
          title: $t('page.serviceManage.common.columns.taskDetail'),
          key: 'taskDetail'
        },
        {
          title: $t('page.serviceManage.common.columns.publishTime'),
          key: 'publishTime'
        },
        {
          title: $t('page.serviceManage.common.columns.deadline'),
          key: 'deadline'
        },
        {
          title: $t('page.serviceManage.common.columns.completionRate'),
          key: 'completionRate'
        },
        {
          title: $t('page.serviceManage.common.columns.action'),
          key: 'actions',
          render(row: RowData) {
            return h(
              NButton,
              {
                size: 'small',
                onClick: () => sendMail(row)
              },
              { default: () => $t('page.serviceManage.common.buttons.startMark') }
            );
          }
        }
      ];
    });

    const data: RowData[] = [
      {
        key: 0,
        taskName: '天河机场',
        publishTime: '3/15',
        deadline: '6/15',
        taskType: '目标检测',
        taskDetail: '对天河机场区域进行目标检测，识别建筑物、道路等目标',
        completionRate: '70%'
      },
      {
        key: 1,
        taskName: '武汉理工大学',
        publishTime: '4/1',
        deadline: '7/15',
        taskType: '地物分类',
        taskDetail: '对武汉理工大学校园进行地物分类，包括建筑物、绿地、道路等',
        completionRate: '已完成'
      }
    ];

    return {
      data,
      columns,
      pagination: {
        pageSize: 10
      }
    };
  }
});
</script>

<template>
  <NSpace vertical :size="12">
    <NDataTable size="large" :columns="columns" :data="data" :pagination="pagination" />
  </NSpace>
</template>
