<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[600px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{t('PATIENT_INFO')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-4 sm:p-6">
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('FULL_NAME')" prop="name">
            <v-input :model-value="patient?.name" readonly />
          </el-form-item>
          <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
            <v-input
              :model-value="patient?.phone"
              v-mask="'+998 ## ### ## ##'"
              readonly
            />
          </el-form-item>
          <!-- <el-form-item label="Middle Name">
            <v-input v-model="form.value" placeholder="Enter middle name" />
          </el-form-item>
          <el-form-item label="Middle Name">
            <v-input v-model="form.value" placeholder="Enter last name" />
          </el-form-item> -->
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
      
          <el-form-item :label="t('BIRTH_DATE')" prop="dateOfBirth">
            <v-date-picker
              :model-value="patient?.dateOfBirth"
              value-format="YYYY-MM-DD"
              format="DD.MM.YYYY"
              @change="calculateAge"
              readonly
            />
          </el-form-item>
          <el-form-item :label="t('AGE')">
            <v-input :model-value="age" readonly />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input :model-value="dayjs(patient?.creationDate).format('DD.MM.YYYY')" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input
              :model-value="patient?.modifiedDate ? dayjs(patient?.modifiedDate).format('DD.MM.YYYY') : ''"
              :readonly="true"
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('GENDER')" prop="question">
            <v-select
              :model-value="patient?.gender"
              :options="genders"
              label-key="label"
              value-key="value"
              :placeholder="t('SELECT_GENDER')"
              readonly
            ></v-select>
          </el-form-item>
          <el-form-item :label="t('OCCUPATION')" prop="question">
            <v-input :model-value="patient?.occupation"  readonly/>
          </el-form-item>
        </div>
        <el-form-item :label="t('ADDRESS')" prop="address">
          <v-input :model-value="patient?.address" type="textarea" :rows="4" readonly />
        </el-form-item>
        <el-form-item :label="t('LEAD_SOURCE')" class="!mb-0">
          <v-input :model-value="patient?.source"  readonly />
        </el-form-item>
      </div>
      <div class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">{{t("CLOSE")}}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
import type { FormInstance } from "element-plus";
import dayjs from "dayjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; patientId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const genders = computed(() => {
  return [
    { label: t("MALE"), value: "MALE"},
    { label: t("FEMALE"), value: "FEMALE" },
  ];
})
const age = ref<any>("");
const patient = ref();
const formRef = ref<FormInstance>();

const getPatientById = async () => {
  (<AxiosInstance>$axios).get(`/api/patient/summary/${props.patientId}`).then((res) => {
    patient.value = res.data.payload;
    calculateAge();
  });
};
const calculateAge = () => {
  const today = new Date();
  const birthDate = new Date(patient.value.dateOfBirth as string);
  const ageDifMs = today.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  age.value = Math.abs(ageDate.getUTCFullYear() - 1970);
};
onMounted(() => {
  if (props.patientId) getPatientById();
});
</script>

<style scoped></style>
