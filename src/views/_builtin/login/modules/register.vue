<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/store/modules/auth'; // ✅ 直接调用 Pinia Store
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'Register'
});

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const userStore = useUserStore();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  userName: '',
  password: '',
  confirmPassword: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();
  return {
    userName: formRules.userName,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  try {
    await validate();
    loading.value = true;

    const result = await userStore.register({
      userName: model.userName,
      userPassword: model.password
    });

    console.log('📢 组件收到的注册结果:', result); // 🔥 确保 `result` 正确

    if (result.success) {
      message.success(`${result.message}`);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } else {
      message.error(`${result.message}`);
    }
  } catch (error) {
    console.error('❌ 注册失败:', error);
    message.error('注册失败，请稍后重试！');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block :loading="loading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" round block @click="router.push('/login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>
