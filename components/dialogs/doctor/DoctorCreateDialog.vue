<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    width="800"
    class="!p-0"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{ doctorId ? t('UPDATE_DOCTOR') : t('ADD_NEW_DOCTOR') }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="p-6">
        <div class="grid grid-cols-3 gap-4">
          <el-form-item :label="t('FIRST_NAME')" prop="firstName">
            <el-input class="form_input" v-model="form.firstName" :placeholder="t('ENTER_FIRST_NAME')" />
          </el-form-item>
          <el-form-item :label="t('MIDDLE_NAME')" prop="middleName">
            <el-input class="form_input" v-model="form.middleName" :placeholder="t('ENTER_MIDDLE_NAME')" />
          </el-form-item>
          <el-form-item :label="t('LAST_NAME')" prop="lastName">
            <el-input class="form_input" v-model="form.lastName" :placeholder="t('ENTER_LAST_NAME')" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <!-- <el-form-item label="Gender" prop="question">
            <v-select
              v-model="form.gender"
              :options="[
                { label: 'foo', value: 'foo' },
                { label: 'bar', value: 'bar' }
              ]"
              label-key="label"
              value-key="value"
              placeholder="Select gender"
            ></v-select>
          </el-form-item> -->
          <el-form-item :label="t('BIRTH_DATE')" prop="dateOfBirth">
            <v-date-picker
              v-model="form.dateOfBirth"
              value-format="YYYY-MM-DD"
              class="form_datepicker"
              format="DD.MM.YYYY"
              @change="calculateAge"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item :label="t('AGE')">
            <el-input class="form_input" v-model="age" :placeholder="t('AUTO_CALCULATED')" readonly />
          </el-form-item>
          <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
            <el-input
              class="form_input"
              v-model="form.phone"
              v-mask="'+998 ## ### ## ##'"
              :placeholder="t('ENTER_PHONE_NUMBER')"
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <el-form-item :label="t('STATUS')" prop="status" class="!mb-0">
            <v-select
              v-model="form.status"
              class="form_select"
              :options="statuses"
              label-key="label"
              value-key="value"
            />
          </el-form-item>
          <el-form-item :label="t('SPECIALITY')" prop="specialization">
            <el-input class="form_input" v-model="form.specialization" :placeholder="t('ENTER_SPECIALITY')" />
          </el-form-item>
          <el-form-item :label="t('DEPARTMENT')" prop="departmentId" class="!mb-0">
            <v-select
              class="form_select"
              filterable
              v-model="form.departmentId"
              :options="departments"
              label-key="name"
              value-key="id"
              remote
              :placeholder="t('SEARCH_AND_SELECT_DEPARTMENT')"
              :loading="loading"
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('USERNAME')" prop="username">
            <el-input class="form_input" v-model="form.username" :placeholder="t('ENTER_USER_NAME')" />
          </el-form-item>
          <el-form-item :label="t('PASSWORD')" prop="password">
            <el-input class="form_input" v-model="form.password" :placeholder="t('ENTER_PASSWORD')" />
          </el-form-item>
        </div>
        <!-- <el-form-item label="Address" class="!mb-0">
          <el-input class="form_input" v-model="form.value" type="textarea" :rows="4" />
        </el-form-item> -->
      </div>
      <div class="flex justify-end gap-3 w-full p-6 border-t border-solid border-gray-line">
        <el-button type="default" class="large_btn large_cancel_btn" @click="emit('close')">{{t('CLOSE')}}</el-button>
        <el-button type="primary" native-type="submit" class="!ml-0 large_btn" :loading="loading">
          {{t('SAVE')}}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AxiosInstance } from "axios";
import type { IDoctorCreate } from "~/types/doctor/index.type";
import type { IDepartmentListItem } from "~/types/department/index.type";
const props = defineProps<{ modelValue: boolean; doctorId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const { phoneNumberValidator } = useValidators();
const { t } = useI18n();
const statuses = useConstants().DOCTOR_STATUSES?.map((i) => ({
  label: t(i),
  value: i,
}));
const rules = {
  username: [{ required: true, message: "", trigger: "change" }],
  password: [
    { required: !props.doctorId, message: "", trigger: "change" },
    { min: 5, message: t('PASSWORD_MESSAGE'), trigger: "blur" },
  ],
  firstName: [{ required: true, message: "", trigger: "change" }],
  lastName: [{ required: true, message: "", trigger: "change" }],
  // middleName: [{ required: true, message: "", trigger: "change" }],
  phone: [
    { required: true, message: "", trigger: "change" },
    { validator: phoneNumberValidator, message: t('VALID_PHONE'), trigger: "blur" },
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
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createDoctor();
  });
};
async function createDoctor() {
  loading.value = true;
  const id = props.doctorId;
  const url = id ? `/api/user/update` : "/api/user/create";
  const method = id ? "put" : "post";
  (<AxiosInstance>$axios)
    [method](url, { ...form, id, phone: cleanPhoneNumber(form.phone || "") })
    .then((res) => {
      notificationShower("success", id ? t('DOCTOR_UPDATE_SUCCESS') : t('DOCTOR_CREATED_SUCCESS'));
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}

const getDoctorById = async () => {
  (<AxiosInstance>$axios).get(`/api/user/summary/${props.doctorId}`).then((res) => {
    form.username = res.data.payload.username;
    form.firstName = res.data.payload.firstName;
    form.lastName = res.data.payload.lastName;
    form.middleName = res.data.payload.middleName;
    form.phone = res.data.payload.phone;
    form.dateOfBirth = res.data.payload.dateOfBirth;
    form.specialization = res.data.payload.specialization;
    form.departmentId = res.data.payload.department?.id;
    form.status = res.data.payload.status;
    calculateAge();
  });
};
const getDepartments = (queryData?: { searchKey: string }) => {
  loading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
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
  if (props.doctorId) getDoctorById();
});
</script>

<style scoped></style>
