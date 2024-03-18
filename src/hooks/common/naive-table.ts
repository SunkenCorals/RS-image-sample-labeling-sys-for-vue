import { computed, effectScope, onScopeDispose, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { useBoolean, useTable } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type TableData = NaiveUI.TableData;

export function useNaiveTable<T extends TableData = TableData, A extends NaiveUI.TableApiFn<T> = NaiveUI.TableApiFn<T>>(
  config: NaiveUI.NaiveTableConfig<T, A>
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const { apiFn, apiParams, immediate } = config;

  const SELECTION_KEY = '__selection__';

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useTable<A, T, NaiveUI.TableColumn<T>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: res => {
      const { records = [], current = 1, size = 10, total = 0 } = res.data || {};

      return {
        data: records,
        pageNum: current,
        pageSize: size,
        total
      };
    },
    getColumnChecks: cols => {
      const checks: NaiveUI.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true
          });
        } else if (column.type === 'selection') {
          checks.push({
            key: SELECTION_KEY,
            title: $t('common.check'),
            checked: true
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, NaiveUI.TableColumn<T>>();

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          columnMap.set(column.key as string, column);
        } else if (column.type === 'selection') {
          columnMap.set(SELECTION_KEY, column);
        }
      });

      const filteredColumns = checks
        .filter(item => item.checked)
        .map(check => columnMap.get(check.key) as NaiveUI.TableColumn<T>);

      return filteredColumns;
    },
    onFetched: async transformed => {
      const { pageNum, pageSize, total } = transformed;

      updatePagination({
        page: pageNum,
        pageSize,
        itemCount: total
      });
    },
    immediate
  });

  const pagination: PaginationProps = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onUpdatePage: async (page: number) => {
      pagination.page = page;

      updateSearchParams({
        current: page,
        size: pagination.pageSize!
      });

      getData();
    },
    onUpdatePageSize: async (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      updateSearchParams({
        current: pagination.page,
        size: pageSize
      });

      getData();
    }
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: appStore.isMobile ? 3 : 9
    };

    return p;
  });

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}

export function useNaiveTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = ref<NaiveUI.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<T | null> = ref(null);

  function handleEdit(id: number) {
    operateType.value = 'edit';
    editingData.value = data.value.find(item => item.id === id) || null;

    openDrawer();
  }

  const checkedRowKeys = ref<string[]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted,
    closeDrawer
  };
}

export function getNaiveTableIndex(pagination: PaginationProps, index: number) {
  const { page = 1, pageSize = 10 } = pagination;

  return (page - 1) * pageSize + index + 1;
}

export function getNaiveTableRowKey<T extends TableData>(row: T) {
  return row.id;
}

function isTableColumnHasKey<T extends TableData>(
  column: NaiveUI.TableColumn<T>
): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}
