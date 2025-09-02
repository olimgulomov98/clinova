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
      <div
        class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line"
      >
        <v-form-title>{{ t("DEPARTMENT_INFO") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-4 sm:p-6">
        <el-form-item :label="t('PARENT_DEPARTMENT')">
          <v-input
            :model-value="departmentData?.parent?.name"
            :readonly="true"
          />
        </el-form-item>
        <el-form-item :label="t('DEPARTMENT_NAME')">
          <v-input :model-value="departmentData?.name" :readonly="true" />
        </el-form-item>
        <div class="grid sm:grid-cols-3 sm:gap-4">
          <el-form-item :label="t('CODE')">
            <v-input :model-value="departmentData?.code" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('ASSIGNED_DOCTORS_COUNT')">
            <v-input
              :model-value="departmentData?.doctorCount"
              :readonly="true"
            />
          </el-form-item>
          <el-form-item :label="t('ASSIGNED_SERVICES_COUNT')">
            <v-input
              :model-value="departmentData?.serviceCount"
              :readonly="true"
            />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input
              :model-value="
                dayjs(departmentData?.creationDate).format('DD.MM.YYYY')
              "
              :readonly="true"
            />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input
              :model-value="
                departmentData?.modifiedDate
                  ? dayjs(departmentData?.modifiedDate).format('DD.MM.YYYY')
                  : ''
              "
              :readonly="true"
            />
          </el-form-item>
        </div>
        <el-form-item :label="t('DEPARTMENT_ABOUT')" class="!mb-0">
          <v-input
            :model-value="departmentData?.description"
            type="textarea"
            :rows="4"
            :readonly="true"
          />
        </el-form-item>
      </div>

      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <v-button type="default" size="xlarge" @click="emit('close')">{{
          t("CLOSE")
        }}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import dayjs from "dayjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; departmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const departmentData = ref();

const getDepartmentById = async () => {
  (<Axios>$axios)
    .get(`/api/department/summary/${props.departmentId}`)
    .then((res) => {
      departmentData.value = res.data.payload;
    });
};
onMounted(() => {
  if (props.departmentId) getDepartmentById();
});
</script>

<style scoped></style>
