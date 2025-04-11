<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, useMessage } from 'naive-ui';
import { useTaskStore } from '@/store/modules/task';
import { $t } from '@/locales';

const taskStore = useTaskStore();

const response = await taskStore.getTaskList({});

interface RowData {
  taskid: number;
  taskname: string;
  type: string;
  mapserver: string;
  daterange: string;
  status: string;
  auditfeedback: string;
}

export default defineComponent({
  setup() {
    const message = useMessage();
    const StartMark = (rowData: RowData) => {
      message.info($t('page.serviceManage.common.messages.startMark', { name: rowData.taskname }));
    };

    const columns = computed<DataTableColumns<RowData>>(() => {
      return [
        {
          title: $t('page.serviceManage.common.columns.taskName'),
          key: 'taskname',
          resizable: true
        },
        {
          title: $t('page.serviceManage.common.columns.taskType'),
          key: 'type',
          resizable: true
        },
        {
          title: '底图服务',
          key: 'mapserver',
          resizable: true
        },
        {
          title: '日期范围',
          key: 'daterange',
          resizable: true
        },
        {
          title: '状态',
          key: 'status',
          resizable: true
        },
        {
          title: '审核反馈',
          key: 'auditfeedback',
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
                  type: 'primary',
                  onClick: () => {
                    message.info('提交任务');
                  }
                },
                { default: () => '提交任务' }
              )
            ]);
          }
        }
      ];
    });

    const data = response;

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
    <NDataTable size="large" :columns="columns" :data="data" :pagination="pagination" :single-line="false" />
  </NSpace>
</template>
