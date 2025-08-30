<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[484px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-4 px-6 pb-0 flex justify-between">
        <v-form-title>{{ t("SCHEDULE_FOLLOW_UP") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <div class="p-4 sm:p-6">
        <div class="grid sm:grid-cols-1">
          <el-form-item :label="t('SELECT_DATE')" prop="time">
            <v-date-picker
              type="datetime"
              v-model="form.time"
              format="DD.MM.YYYY HH:mm"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item :label="t('DEPARTMENT')">
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
          <el-form-item :label="t('SELECT_SERVICE')" prop="serviceId">
            <v-select
              :disabled="!departmentId"
              filterable
              v-model="form.serviceId"
              :options="services"
              label-key="name"
              value-key="id"
              remote
              :placeholder="t('SEARCH_FOR_SERVICE')"
              :remote-method="remoteServiceMethod"
              :suffix-icon="Search"
              :loading="selectLoading"
              remote-show-suffix
            />
          </el-form-item>
          <el-form-item :label="t('SELECT_DOCTOR')" prop="doctorId">
            <v-select
              filterable
              v-model="form.doctorId"
              :options="doctors"
              label-key="name"
              value-key="id"
              remote
              :placeholder="t('SEARCH_FOR_DOCTOR')"
              :remote-method="remoteDoctorMethod"
              :disabled="!form.serviceId"
              :suffix-icon="Search"
              :loading="selectLoading"
              remote-show-suffix
            />
          </el-form-item>
          <v-button
            type="primary"
            size="xlarge"
            native-type="submit"
            class="!ml-0 w-full"
            :loading="loading"
          >
            {{ t("SAVE") }}
          </v-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
import { dayjs, type FormInstance } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { debounce } from "lodash";
import type { IDepartmentListItem } from "~/types/department/index.type";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; followUpId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const route = useRoute();
const selectLoading = ref(false);
const departments = ref<{ id: number; name: string }[]>([]);
const departmentId = ref<number | undefined>(undefined);
const rules = {
  time: [{ required: true, message: "", trigger: "change" }],
  serviceId: [{ required: true, message: "", trigger: "change" }],
  doctorId: [{ required: true, message: "", trigger: "change" }],
};
const loading = ref(false);
const services = ref<{ id: number; name: string }[]>([]);
const doctors = ref<{ id: number; name: string }[]>([]);
const form = reactive<Partial<any>>({
  time: "",
  visitId: Number(route.params?.id) || undefined,
  serviceId: undefined,
  doctorId: undefined,
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    await createAppointment();
  });
};

const changeDepartment = () => {
  getServices();
};

async function createAppointment() {
  loading.value = true;
  const time = dayjs(form.time)
    .format("YYYY-MM-DDTHH:mm:ssZ")
    .replace("+05:00", "");
  const id = props.followUpId;
  const url = id ? `/api/follow-up/update` : "/api/follow-up/create";
  const method = id ? "put" : "post";
  (<AxiosInstance>$axios)
    [method](url, { ...form, id, time })
    .then((res) => {
      notificationShower(
        "success",
        id ? t("UPDATED_SUCCESS") : t("CREATED_SUCCESS")
      );
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}

const getAppointmentById = async () => {
  (<AxiosInstance>$axios)
    .get(`/api/appointment/summary/${props.followUpId}`)
    .then((res) => {
      const data = res?.data?.payload;
      if (data) {
        form.time = data.time;
        form.doctorId = data?.doctor?.id;
        form.serviceId = data?.service?.id;
      }
    });
};
const remoteServiceMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getServices(queryData);
}, 300);
const remoteDoctorMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getDoctors(queryData);
}, 300);
const getServices = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/service/list", {
      ...queryData,
      size: 500,
      departmentId: departmentId.value,
    })
    .then((res) => {
      services.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};

const getDepartments = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, showAll: true, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};
const getDoctors = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/user/list", {
      ...queryData,
      size: 500,
      role: "DOCTOR",
      serviceId: form.serviceId,
    })
    .then((res) => {
      doctors.value =
        res?.data?.payload?.list?.map((item: any) => ({
          ...item,
          name: `${item.firstName} ${item.lastName}`,
        })) || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};

const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};
onMounted(() => {
  getDepartments();
  if (props.followUpId) getAppointmentById();
});
</script>

<style scoped></style>
