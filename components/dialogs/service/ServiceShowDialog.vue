<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[700px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{t('SERVICE_INFO')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-4 sm:p-6">
        <el-form-item :label="t('SERVICE_NAME')">
          <v-input :model-value="serviceData?.name" :readonly="true" />
        </el-form-item>
        <div class="grid sm:grid-cols-3 sm:gap-4">
          <el-form-item :label="t('CODE')">
            <v-input :model-value="serviceData?.code" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('PRICE')">
            <v-input :model-value="serviceData?.price" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('RELATED_DEPARTMENT')" prop="departmentId">
            <v-input :model-value="serviceData?.department?.name" :readonly="true" />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input :model-value="dayjs(serviceData?.creationDate).format('DD.MM.YYYY')" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input
              :model-value="serviceData?.modifiedDate ? dayjs(serviceData?.modifiedDate).format('DD.MM.YYYY') : ''"
              :readonly="true"
            />
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">{{t('CLOSE')}}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import dayjs from "dayjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; serviceId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const serviceData = ref();

const getServiceById = async () => {
  (<Axios>$axios).get(`/api/service/summary/${props.serviceId}`).then((res) => {
    serviceData.value = res.data.payload;
  });
};

onMounted(() => {
  if (props.serviceId) getServiceById();
});
</script>

<style scoped></style>
