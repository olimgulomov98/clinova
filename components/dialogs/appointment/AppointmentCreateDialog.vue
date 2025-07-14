<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[800px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{ appointmentId ? t('RESCHEDULE') : t("ADD_NEW_APPOINTMENT") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="p-4 sm:p-6">
        <div class="grid sm:grid-cols-1">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item v-if="!appointmentId" :label="t('PATIENT_NAME')" prop="patientName">
              <el-input v-model="form.patientName" class="form_input" :placeholder="t('ENTER_PATIENT_NAME')" />
            </el-form-item>
            <el-form-item v-if="!appointmentId" :label="t('PATIENT_PHONE')" prop="patientPhone">
              <el-input
                v-model="form.patientPhone"
                class="form_input"
                :placeholder="t('ENTER_PATIENT_PHONE')"
                v-mask="'+998 ## ### ## ##'"
              />
            </el-form-item>
          </div>
          <el-form-item v-if="appointmentId" :label="t('PATIENT_NAME')" prop="patientName">
            <el-input :model-value="form.patientName" class="form_input" :placeholder="t('ENTER_PATIENT_NAME')" readonly />
          </el-form-item>
          <el-form-item :label="t('DATE')" prop="time">
            <v-date-picker
              type="datetime"
              v-model="form.time"
              format="DD.MM.YYYY HH:mm"
              class="form_datepicker"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item  v-if="!appointmentId" :label="t('DEPARTMENT')">
            <v-select
              filterable
              v-model="departmentId"
              :options="departments"
              label-key="name"
              value-key="id"
              :placeholder="t('DEPARTMENT')"
              class="form_select"
              @change="changeDepartment"
            />
          </el-form-item>
          <el-form-item v-if="!appointmentId" :label="t('SERVICE')" prop="serviceId">
            <v-select
            :disabled="!departmentId"
              filterable
              v-model="form.serviceId"
              :options="services"
              label-key="name"
              value-key="id"
              remote
              :placeholder="t('SERVICE')"
              class="form_select_search"
              :remote-method="remoteServiceMethod"
              :suffix-icon="Search"
              :loading="selectLoading"
              remote-show-suffix
            />
          </el-form-item>
        </div>
        <div v-if="!appointmentId" class="grid grid-cols-1 gap-4">
          <el-form-item :label="t('DOCTORS')" prop="doctorId">
            <v-select
              filterable
              v-model="form.doctorId"
              :options="doctors"
              label-key="name"
              value-key="id"
              remote
              class="form_select_search"
              :placeholder="t('SELECT_DOCTOR')"
              :disabled="!form.serviceId"
            />
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line">
        <el-button type="default" class="large_btn large_cancel_btn" @click="emit('close')">{{t('CANCEL')}}</el-button>
        <el-button type="primary" native-type="submit" class="!ml-0 large_btn" :loading="loading">
          {{ !appointmentId ? t('SAVE_APPOINTMENT') : t("SAVE") }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
import { dayjs, type FormInstance } from "element-plus";
import { debounce } from "lodash";
import type { IAppointmentCreate } from "~/types/appointment/index.type";
import { Search } from "@element-plus/icons-vue";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { de } from "element-plus/es/locale/index.mjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; appointmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const { phoneNumberValidator } = useValidators();
const rules = {
  time: [{ required: true, message: "", trigger: "change" }],
  patientName: [{ required: true, message: "", trigger: "change" }],
  patientPhone: [
    { required: true, message: "", trigger: "change" },
    { validator: phoneNumberValidator, message: t('VALID_PHONE'), trigger: "blur" },
  ],
  serviceId: [{ required: true, message: "", trigger: "change" }],
  doctorId: [{ required: true, message: "", trigger: "change" }],
};
const selectLoading = ref(false);
const loading = ref(false);
const services = ref<{ id: number; name: string }[]>([]);
const doctors = ref<{ id: number; name: string }[]>([]);
const departments = ref<{ id: number; name: string }[]>([]);
const departmentId = ref<number | undefined>(undefined);
const form = reactive<Partial<IAppointmentCreate>>({
  time: "",
  patientName: "",
  patientPhone: "",
  serviceId: undefined,
  doctorId: undefined,
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createAppointment();
  });
};

async function createAppointment() {
  loading.value = true;
  const time = dayjs(form.time).format("YYYY-MM-DDTHH:mm:ssZ").replace("+05:00", "");
  const id = props.appointmentId;
  const url = id ? `/api/appointment/update` : "/api/appointment/create";
  const method = id ? "put" : "post";
  (<AxiosInstance>$axios)
    [method](url, { ...form, patientPhone: cleanPhoneNumber(form.patientPhone || ""), id, time })
    .then((res) => {
      notificationShower("success", id ? t('APPOINTMENT_UPDATE_SUCCESS') : t('APPOINTMENT_CREATED_SUCCESS'));
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}

const getAppointmentById = async () => {
  (<AxiosInstance>$axios).get(`/api/appointment/summary/${props.appointmentId}`).then((res) => {
    const data = res?.data?.payload;
    if (data) {
      form.time = data.time;
      form.doctorId = data?.doctor?.id;
      form.serviceId = data?.service?.id;
      form.patientName = data?.patientName;
      form.patientPhone = data?.patientPhone;
    }
  });
};
const remoteServiceMethod = debounce((query: string) => {
  const queryData = { searchKey: query || undefined };
  if(query.length > 1) getServices(queryData);
}, 300);
const getServices = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/service/list", { ...queryData, size: 500, departmentId: departmentId.value })
    .then((res) => {
      services.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};
const getDoctors = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/user/list", { ...queryData, size: 500, role: "DOCTOR", status: "AVAILABLE", serviceId: form.serviceId })
    .then((res) => {
      doctors.value =
        res?.data?.payload?.list?.map((item: any) => ({ ...item, name: `${item.firstName} ${item.lastName}` })) || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};
const getDepartments = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};

const changeDepartment = () => {
  getServices();
};
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};
onMounted(() => {
  getDepartments();
  getDoctors();
  getServices();
  if (props.appointmentId) getAppointmentById();
});
</script>

<style scoped></style>
