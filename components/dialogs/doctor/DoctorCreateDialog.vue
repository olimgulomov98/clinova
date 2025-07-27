<template>
  <div class="p-6">
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <v-form-title class="mb-6">
        {{ t("EMPLOYEE_INFORMATION") }}
      </v-form-title>

      <div class="grid grid-cols-3 gap-4">
        <el-form-item :label="t('FIRST_NAME')" prop="firstName">
          <el-input v-model="form.firstName" />
        </el-form-item>
        <el-form-item :label="t('MIDDLE_NAME')" prop="middleName">
          <el-input v-model="form.middleName" />
        </el-form-item>
        <el-form-item :label="t('LAST_NAME')" prop="lastName">
          <el-input v-model="form.lastName" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <el-form-item :label="t('BIRTH_DATE')" prop="dateOfBirth">
          <v-date-picker
            v-model="form.dateOfBirth"
            value-format="YYYY-MM-DD"
            format="DD.MM.YYYY"
            class="form_datepicker"
            @change="calculateAge"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item :label="t('AGE')">
          <el-input v-model="age" readonly />
        </el-form-item>
        <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
          <el-input
            v-model="form.phone"
            v-mask="'+998 ## ### ## ##'"
            :placeholder="t('ENTER_PHONE_NUMBER')"
          />
        </el-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <el-form-item :label="t('STATUS')" prop="status">
          <v-select
            v-model="form.status"
            class="form_select"
            :options="statuses"
            label-key="label"
            value-key="value"
          />
        </el-form-item>
        <el-form-item :label="t('SPECIALITY')" prop="specialization">
          <el-input v-model="form.specialization" />
        </el-form-item>
        <el-form-item :label="t('DEPARTMENT')" prop="departmentId">
          <v-select
            v-model="form.departmentId"
            class="form_select"
            filterable
            :options="departments"
            label-key="name"
            value-key="id"
            remote
            :loading="loading"
            :placeholder="t('SEARCH_AND_SELECT_DEPARTMENT')"
          />
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item :label="t('USERNAME')" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item :label="t('PASSWORD')" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
      </div>

      <div class="flex justify-end mt-6">
        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="large_btn"
        >
          {{ t("SAVE") }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AxiosInstance } from "axios";
import type { IDoctorCreate } from "~/types/doctor/index.type";
import type { IDepartmentListItem } from "~/types/department/index.type";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { $axios } = useNuxtApp();
const { phoneNumberValidator } = useValidators();
const doctorId = computed(() => Number(route.params?.doctorId) || undefined);

const rules = {
  username: [{ required: true, message: "", trigger: "change" }],
  password: [
    { required: !doctorId.value, message: "", trigger: "change" },
    { min: 5, message: t("PASSWORD_MESSAGE"), trigger: "blur" },
  ],
  firstName: [{ required: true, message: "", trigger: "change" }],
  lastName: [{ required: true, message: "", trigger: "change" }],
  // middleName: [{ required: true, message: "", trigger: "change" }],
  phone: [
    { required: true, message: "", trigger: "change" },
    {
      validator: phoneNumberValidator,
      message: t("VALID_PHONE"),
      trigger: "blur",
    },
  ],
  dateOfBirth: [{ required: true, message: "", trigger: "change" }],
  specialization: [{ required: true, message: "", trigger: "change" }],
  departmentId: [{ required: true, message: "", trigger: "change" }],
  status: [{ required: true, message: "", trigger: "change" }],
};

const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);
const age = ref<any>("");
const form = reactive<Partial<IDoctorCreate>>({
  username: "",
  password: undefined,
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  dateOfBirth: "",
  specialization: "",
  departmentId: undefined,
  roles: ["DOCTOR"],
  status: "AVAILABLE",
});
const formRef = ref<FormInstance>();

const statuses = useConstants().DOCTOR_STATUSES?.map((i) => ({
  label: t(i),
  value: i,
}));

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    await createDoctor();
  });
};

async function createDoctor() {
  loading.value = true;
  const id = doctorId.value;
  const url = id ? `/api/user/update` : "/api/user/create";
  const method = id ? "put" : "post";
  try {
    await (<AxiosInstance>$axios)[method](url, {
      ...form,
      id,
      phone: cleanPhoneNumber(form.phone || ""),
    });
    notificationShower(
      "success",
      id ? t("DOCTOR_UPDATE_SUCCESS") : t("DOCTOR_CREATED_SUCCESS")
    );
    router.push("/doctors");
  } finally {
    loading.value = false;
  }
}

const getDoctorById = async () => {
  const { data } = await (<AxiosInstance>$axios).get(
    `/api/user/summary/${doctorId.value}`
  );
  const d = data.payload;
  form.username = d.username;
  form.firstName = d.firstName;
  form.lastName = d.lastName;
  form.middleName = d.middleName;
  form.phone = d.phone;
  form.dateOfBirth = d.dateOfBirth;
  form.specialization = d.specialization;
  form.departmentId = d.department?.id;
  form.status = d.status;
  calculateAge();
};

const getDepartments = async () => {
  loading.value = true;
  try {
    const res = await (<AxiosInstance>$axios).post("/api/department/list", {
      size: 500,
    });
    departments.value = res.data.payload?.list || [];
  } finally {
    loading.value = false;
  }
};

const calculateAge = () => {
  const today = new Date();
  const birthDate = new Date(form.dateOfBirth as string);
  const ageDifMs = today.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  age.value = Math.abs(ageDate.getUTCFullYear() - 1970);
};

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

onMounted(() => {
  getDepartments();
  if (doctorId.value) getDoctorById();
});
</script>

<style scoped></style>
