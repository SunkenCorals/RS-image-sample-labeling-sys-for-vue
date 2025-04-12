<script setup lang="ts">
import { NCard, NForm, NFormItemGi, NSelect } from 'naive-ui';
import { $t } from '@/locales';
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm label-placement="left" :label-width="80">
      <NGrid cols="12" responsive="screen" item-responsive>
        <!-- 任务名称-->
        <NFormItemGi span="4" :label="$t('page.common.taskName')" class="pr-24px" path="taskName">：{{}}</NFormItemGi>

        <!-- 任务类型 -->
        <NFormItemGi span="4" :label="$t('page.common.taskType')" class="pr-24px" path="taskType" required>
          <NSelect :placeholder="$t('page.usermanage.common.searchPlaceholder')" clearable />
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
