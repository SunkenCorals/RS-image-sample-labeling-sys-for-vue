<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
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
    const router = useRouter();

    const handleStartMark = (rowData: any) => {
      window.sessionStorage.setItem('taskId', rowData.taskid);
      router.push({ name: 'markpage' });
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
          resizable: true,
          render: (row: RowData) => {
            let color;
            let text;
            switch (Number(row.status)) {
              case 0:
                text = '审核中';
                color = 'processing';
                break;
              case 1:
                text = '审核通过';
                color = 'success';
                break;
              case 2:
                text = '审核未通过';
                color = 'error';
                break;
              case 3:
                text = '未提交';
                color = '#BDBDBD';
                break;
              default:
                break;
            }
            // 使用 text 和 color 变量创建一个带有样式的文本节点
            if (text && color) {
              return h('span', { style: { color } }, text);
            }
            return null;
          }
        },
        {
          title: '审核反馈',
          key: 'auditfeedback',
          resizable: true,
          render(row: RowData) {
            // 若 auditfeedback 为空，设置默认值
            return row.auditfeedback || '无';
          }
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
                  onClick: () => handleStartMark(row)
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
