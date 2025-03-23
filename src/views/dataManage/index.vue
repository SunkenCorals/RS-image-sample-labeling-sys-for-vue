<script setup lang="tsx">
import { computed, h, ref } from 'vue';
import { NBreadcrumb, NBreadcrumbItem, NButton, NCard, NDropdown, NIcon, NInput, NSpace } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { $t } from '@/locales';

// 模拟 MinIO 数据结构
interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  lastModified: string;
  path: string;
  children?: FileItem[];
}

// 模拟数据
const mockData: FileItem[] = [
  {
    id: '1',
    name: '遥感影像数据',
    type: 'folder',
    path: '/遥感影像数据',
    lastModified: '2024-03-20',
    children: [
      {
        id: '1-1',
        name: '2024年数据',
        type: 'folder',
        path: '/遥感影像数据/2024年数据',
        lastModified: '2024-03-19',
        children: [
          {
            id: '1-1-1',
            name: '北京地区影像',
            type: 'folder',
            path: '/遥感影像数据/2024年数据/北京地区影像',
            lastModified: '2024-03-18',
            children: [
              {
                id: '1-1-1-1',
                name: '北京地区影像',
                type: 'folder',
                path: '/遥感影像数据/2024年数据/北京地区影像/北京地区影像',
                lastModified: '2024-03-18',
                children: [
                  {
                    id: '1-1-1-1-1',
                    name: 'beijing_2024_01.tif',
                    type: 'file',
                    size: '2.5GB',
                    path: '/遥感影像数据/2024年数据/北京地区影像/北京地区影像/beijing_2024_01.tif',
                    lastModified: '2024-03-17'
                  },
                  {
                    id: '1-1-1-1-2',
                    name: 'beijing_2024_02.tif',
                    type: 'file',
                    size: '2.8GB',
                    path: '/遥感影像数据/2024年数据/北京地区影像/北京地区影像/beijing_2024_02.tif',
                    lastModified: '2024-03-16'
                  }
                ]
              },
              {
                id: '1-1-2',
                name: '上海地区影像',
                type: 'folder',
                path: '/遥感影像数据/2024年数据/上海地区影像',
                lastModified: '2024-03-18',
                children: [
                  {
                    id: '1-1-2-1',
                    name: 'shanghai_2024_01.tif',
                    type: 'file',
                    size: '2.3GB',
                    path: '/遥感影像数据/2024年数据/上海地区影像/shanghai_2024_01.tif',
                    lastModified: '2024-03-17'
                  }
                ]
              }
            ]
          },
          {
            id: '1-2',
            name: '2023年数据',
            type: 'folder',
            path: '/遥感影像数据/2023年数据',
            lastModified: '2024-03-19',
            children: [
              {
                id: '1-2-1',
                name: '历史影像',
                type: 'folder',
                path: '/遥感影像数据/2023年数据/历史影像',
                lastModified: '2024-03-18',
                children: [
                  {
                    id: '1-2-1-1',
                    name: 'beijing_2023_12.tif',
                    type: 'file',
                    size: '2.4GB',
                    path: '/遥感影像数据/2023年数据/历史影像/beijing_2023_12.tif',
                    lastModified: '2023-12-31'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '1-2',
        name: '2023年数据',
        type: 'folder',
        path: '/遥感影像数据/2023年数据',
        lastModified: '2024-03-19',
        children: [
          {
            id: '1-2-1',
            name: '历史影像',
            type: 'folder',
            path: '/遥感影像数据/2023年数据/历史影像',
            lastModified: '2024-03-18',
            children: [
              {
                id: '1-2-1-1',
                name: 'beijing_2023_12.tif',
                type: 'file',
                size: '2.4GB',
                path: '/遥感影像数据/2023年数据/历史影像/beijing_2023_12.tif',
                lastModified: '2023-12-31'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '标注结果',
    type: 'folder',
    path: '/标注结果',
    lastModified: '2024-03-19',
    children: [
      {
        id: '2-1',
        name: '建筑物标注',
        type: 'folder',
        path: '/标注结果/建筑物标注',
        lastModified: '2024-03-18',
        children: [
          {
            id: '2-1-1',
            name: 'beijing_buildings_2024_01.json',
            type: 'file',
            size: '1.2MB',
            path: '/标注结果/建筑物标注/beijing_buildings_2024_01.json',
            lastModified: '2024-03-17'
          },
          {
            id: '2-1-2',
            name: 'shanghai_buildings_2024_01.json',
            type: 'file',
            size: '1.5MB',
            path: '/标注结果/建筑物标注/shanghai_buildings_2024_01.json',
            lastModified: '2024-03-16'
          }
        ]
      },
      {
        id: '2-2',
        name: '道路标注',
        type: 'folder',
        path: '/标注结果/道路标注',
        lastModified: '2024-03-18',
        children: [
          {
            id: '2-2-1',
            name: 'beijing_roads_2024_01.json',
            type: 'file',
            size: '2.1MB',
            path: '/标注结果/道路标注/beijing_roads_2024_01.json',
            lastModified: '2024-03-17'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: '处理结果',
    type: 'folder',
    path: '/处理结果',
    lastModified: '2024-03-19',
    children: [
      {
        id: '3-1',
        name: '建筑物提取',
        type: 'folder',
        path: '/处理结果/建筑物提取',
        lastModified: '2024-03-18',
        children: [
          {
            id: '3-1-1',
            name: 'beijing_buildings_2024_01_result.tif',
            type: 'file',
            size: '1.8GB',
            path: '/处理结果/建筑物提取/beijing_buildings_2024_01_result.tif',
            lastModified: '2024-03-17'
          }
        ]
      }
    ]
  }
];

// 当前路径
const currentPath = ref('/');
const searchQuery = ref('');
const viewMode = ref<'list' | 'icon'>('list');

// 当前目录下的文件和文件夹
const currentItems = computed(() => {
  if (currentPath.value === '/') {
    return mockData;
  }

  const findItems = (items: FileItem[], path: string): FileItem[] | undefined => {
    for (const item of items) {
      if (item.path === path) {
        return item.children;
      }
      if (item.children) {
        const found = findItems(item.children, path);
        if (found) return found;
      }
    }
    return undefined;
  };

  return findItems(mockData, currentPath.value) || [];
});

// 路径导航数据
const pathItems = computed(() => {
  const paths = currentPath.value.split('/').filter(Boolean);
  return [
    { name: $t('page.datamanage.common.root'), path: '/' },
    ...paths.map((path, index) => ({
      name: path,
      path: `/${paths.slice(0, index + 1).join('/')}`
    }))
  ];
});

// 处理文件夹点击
const handleFolderClick = (path: string) => {
  currentPath.value = path;
};

// 处理路径导航点击
const handlePathClick = (path: string) => {
  currentPath.value = path;
};

// 文件操作菜单选项
const fileActions = computed(() => [
  {
    label: $t('page.datamanage.common.newFile'),
    key: 'newFile',
    icon: renderIcon('material-symbols:add')
  },
  {
    label: $t('page.datamanage.common.newFolder'),
    key: 'newFolder',
    icon: renderIcon('material-symbols:create-new-folder')
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: $t('page.datamanage.common.download'),
    key: 'download',
    icon: renderIcon('material-symbols:download')
  },
  {
    label: $t('page.datamanage.common.rename'),
    key: 'rename',
    icon: renderIcon('material-symbols:edit')
  },
  {
    label: $t('page.datamanage.common.viewInfo'),
    key: 'info',
    icon: renderIcon('material-symbols:info')
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: $t('page.datamanage.common.delete'),
    key: 'delete',
    icon: renderIcon('material-symbols:delete')
  }
]);

// 渲染图标的辅助函数
function renderIcon(icon: string) {
  return () => h(NIcon, null, { default: () => h(Icon, { icon }) });
}

// 右键菜单位置
const contextMenuPosition = ref({ x: 0, y: 0 });
const showContextMenu = ref(false);
const currentContextItem = ref<FileItem | null>(null);

// 处理右键菜单
const handleContextMenu = (e: MouseEvent, item: FileItem) => {
  e.preventDefault();
  e.stopPropagation();
  contextMenuPosition.value = { x: e.clientX, y: e.clientY };
  currentContextItem.value = item;
  showContextMenu.value = true;
};

// 处理点击其他地方关闭右键菜单
const handleClickOutside = () => {
  showContextMenu.value = false;
};

// 处理文件操作
const handleFileAction = (key: string) => {
  if (!currentContextItem.value) return;

  switch (key) {
    case 'newFile':
      console.log(`${$t('page.datamanage.common.newFile')}:`, currentContextItem.value);
      break;
    case 'newFolder':
      console.log(`${$t('page.datamanage.common.newFolder')}:`, currentContextItem.value);
      break;
    case 'download':
      console.log(`${$t('page.datamanage.common.download')}:`, currentContextItem.value);
      break;
    case 'rename':
      console.log(`${$t('page.datamanage.common.rename')}:`, currentContextItem.value);
      break;
    case 'info':
      console.log(`${$t('page.datamanage.common.viewInfo')}:`, currentContextItem.value);
      break;
    case 'delete':
      console.log(`${$t('page.datamanage.common.delete')}:`, currentContextItem.value);
      break;
    default:
      console.log(`${$t('page.datamanage.common.unknown')}:`, key);
      break;
  }
  showContextMenu.value = false;
};
</script>

<template>
  <div class="h-full flex flex-col">
    <NCard :bordered="false" size="small" class="flex flex-col flex-1">
      <!-- 顶部工具栏 -->
      <NSpace justify="space-between" align="center" class="mb-4">
        <NSpace>
          <NInput
            v-model:value="searchQuery"
            :placeholder="$t('page.datamanage.common.search')"
            clearable
            class="w-300px"
          >
            <template #prefix>
              <NIcon>
                <Icon icon="material-symbols:search" />
              </NIcon>
            </template>
          </NInput>
        </NSpace>
        <NSpace>
          <NButton quaternary @click="viewMode = viewMode === 'list' ? 'icon' : 'list'">
            <template #icon>
              <NIcon>
                <Icon :icon="viewMode === 'list' ? 'material-symbols:grid-view' : 'material-symbols:view-list'" />
              </NIcon>
            </template>
          </NButton>
          <NButton type="primary">
            <template #icon>
              <NIcon>
                <Icon icon="material-symbols:add" />
              </NIcon>
            </template>
            {{ $t('page.datamanage.common.new') }}
          </NButton>
        </NSpace>
      </NSpace>

      <!-- 路径导航 -->
      <div class="mb-4">
        <NBreadcrumb>
          <NBreadcrumbItem v-for="item in pathItems" :key="item.path" @click="handlePathClick(item.path)">
            {{ item.name }}
          </NBreadcrumbItem>
        </NBreadcrumb>
      </div>

      <!-- 文件列表 -->
      <div class="flex-1 overflow-hidden">
        <div class="h-full overflow-y-auto" :class="[viewMode === 'icon' ? 'grid grid-cols-8 gap-1 p-2' : '']">
          <div
            v-for="item in currentItems"
            :key="item.id"
            class="flex cursor-pointer items-center rd-4px p-3 transition-colors duration-200"
            :class="viewMode === 'icon' ? 'flex-col p-2 aspect-square w-120px mx-auto' : ''"
            @click="item.type === 'folder' && handleFolderClick(item.path)"
            @contextmenu="handleContextMenu($event, item)"
          >
            <template v-if="viewMode === 'list'">
              <NSpace align="center" justify="space-between" class="w-full">
                <NSpace align="center" :size="12">
                  <NIcon class="flex items-center">
                    <Icon
                      :icon="
                        item.type === 'folder' ? 'material-symbols:folder-outline' : 'material-symbols:description'
                      "
                    />
                  </NIcon>
                  <span class="flex items-center">{{ item.name }}</span>
                </NSpace>
                <NSpace align="center" :size="12">
                  <span class="text-text-3 flex items-center text-14px">{{ item.lastModified }}</span>
                  <span v-if="item.size" class="text-text-3 flex items-center text-14px">{{ item.size }}</span>
                  <NDropdown :options="fileActions" @select="key => handleFileAction(key)">
                    <NButton quaternary>
                      <NIcon>
                        <Icon icon="material-symbols:more-vert" />
                      </NIcon>
                    </NButton>
                  </NDropdown>
                </NSpace>
              </NSpace>
            </template>
            <template v-else>
              <div class="h-full w-full flex flex-col items-center justify-center gap-1">
                <NIcon class="text-48px">
                  <Icon
                    :icon="item.type === 'folder' ? 'material-symbols:folder-outline' : 'material-symbols:description'"
                  />
                </NIcon>
                <span class="max-w-full truncate text-center text-14px">{{ item.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 右键菜单 -->
    <NDropdown
      v-if="showContextMenu"
      :options="fileActions"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      :show="showContextMenu"
      trigger="manual"
      @select="handleFileAction"
      @clickoutside="handleClickOutside"
    />
  </div>
</template>

<style scoped>
.n-card {
  height: 100%;
}

.n-card__content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
