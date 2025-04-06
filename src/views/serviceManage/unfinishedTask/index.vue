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
    const StartMark = (rowData: RowData) => {
      message.info($t('page.serviceManage.common.messages.startMark', { name: rowData.taskName }));
    };

    const columns = computed<DataTableColumns<RowData>>(() => {
      return [
        {
          title: $t('page.serviceManage.common.columns.taskName'),
          key: 'taskName',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.taskType'),
          key: 'taskType',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.taskDetail'),
          key: 'taskDetail',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.publishTime'),
          key: 'publishTime',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.deadline'),
          key: 'deadline',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.completionRate'),
          key: 'completionRate',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.action'),
          key: 'actions',
          resizable: true,
          render(row: RowData) {
            return h('div', { style: { display: 'flex', gap: '8px' } }, [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  onClick: () => StartMark(row)
                },
                { default: () => $t('page.serviceManage.common.buttons.startMark') }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => {
                    message.info($t('common.delete', { name: row.taskName }));
                  }
                },
                { default: () => $t('common.delete') }
              )
            ]);
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
