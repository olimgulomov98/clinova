<template>
  <el-dialog
      :destroy-on-close="true"
      :show-close="false"
      :model-value="modelValue"
      width="500"
      class="!p-0"
      @update:model-value="emit('update:modelValue', $event)"
      @close="emit('close')"
  >
    <template #header>
      <div class="p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{t('UPDATE_STATUS')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="p-6">
        <div class="grid grid-cols-1">
          <el-form-item :label="t('STATUS')" prop="status" class="!mb-0">
            <v-select v-model="form.status" :options="statuses" label-key="label" value-key="value" />
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end gap-3 w-full p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">{{t('CANCEL')}}</v-button>
        <v-button type="primary" size="xlarge" native-type="submit" class="!ml-0" :loading="loading">{{t('SAVE')}}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AxiosInstance } from "axios";
import type { IDoctorCreate } from "~/types/doctor/index.type";
const props = defineProps<{ modelValue: boolean; appointmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const { t } = useI18n();
const statuses = useConstants().APPOINTMENTS_STATUSES?.map((i) => ({
  label: t(i),
  value: i,
}));
const rules = {
  status: [{ required: true, message: "", trigger: "change" }],
};
const loading = ref(false);
const form = reactive<Partial<IDoctorCreate>>({
  status: "",
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createDoctor();
  });
};
async function createDoctor() {
  loading.value = true;
  const id = props.appointmentId;
  const url = `/api/follow-up/confirm/${id}`;
  const method = "post";
  (<AxiosInstance>$axios)
      [method](url, {}, { params: { id, confirm: form.status === "CONFIRMED" } })
      .then((res) => {
        notificationShower("success", t('STATUS_UPDATE_SUCCESS'));
        emit("close");
        emit("getData");
      })
      .finally(() => {
        loading.value = false;
      });
}

const getAppointmentById = async () => {
  (<AxiosInstance>$axios).get(`/api/follow-up/summary/${props.appointmentId}`).then((res) => {
    form.status = res.data.payload.status;
  });
};

onMounted(() => {
  if (props.appointmentId) getAppointmentById();
});
</script>

<style scoped></style>
