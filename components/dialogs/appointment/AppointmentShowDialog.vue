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
        <v-form-title>{{t('APPOINTMENT_INFO')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-4 sm:p-6">
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('DATE')" prop="time">
            <v-date-picker :model-value="appointment?.time" format="DD.MM.YYYY" readonly />
          </el-form-item>
          <el-form-item :label="t('SERVICE')" prop="serviceId" class="!mb-0">
            <v-select
              :model-value="appointment?.serviceId"
              :options="services"
              label-key="name"
              value-key="id"
              :placeholder="t('SELECT_SERVICE')"
              disabled
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <el-form-item :label="t('DOCTORS')" prop="doctorId">
            <v-select
              :model-value="appointment?.doctorId"
              :options="doctors"
              label-key="name"
              value-key="id"
              disabled
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('PATIENT_NAME')" prop="patientName">
            <v-input :model-value="appointment?.patientName"  :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('PATIENT_PHONE')" prop="patientPhone">
            <v-input
              :model-value="appointment?.patientPhone"
              v-mask="'+998 ## ### ## ##'"
              :readonly="true"
            />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input :model-value="dayjs(appointment?.creationDate).format('DD.MM.YYYY')" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input
              :model-value="appointment?.modifiedDate ? dayjs(appointment?.modifiedDate).format('DD.MM.YYYY') : ''"
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
import type { AxiosInstance } from "axios";
import { dayjs, type FormInstance } from "element-plus";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; appointmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();

const services = ref<{ id: number; name: string }[]>([]);
const doctors = ref<{ id: number; name: string }[]>([]);
const formRef = ref<FormInstance>();
const appointment = ref()

const getAppointmentById = async () => {
  (<AxiosInstance>$axios).get(`/api/appointment/summary/${props.appointmentId}`).then((res) => {
    const data = res?.data?.payload;
    if (data) {
      appointment.value = data
      appointment.value.doctorId = data?.doctor?.id
      appointment.value.serviceId = data?.service?.id
      doctors.value.push({...data?.doctor})
      services.value.push({...data?.service})
    }
  });
};

onMounted(() => {
  if (props.appointmentId) getAppointmentById();
});
</script>

<style scoped></style>
