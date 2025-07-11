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
        <v-form-title>{{t('DOCTOR_INFO')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-6">
        <div class="grid grid-cols-3 gap-4">
          <el-form-item :label="t('FIRST_NAME')" prop="firstName">
            <v-input :model-value="doctor?.firstName" readonly />
          </el-form-item>
          <el-form-item :label="t('MIDDLE_NAME')" prop="middleName">
            <v-input :model-value="doctor?.middleName" readonly />
          </el-form-item>
          <el-form-item :label="t('LAST_NAME')" prop="lastName">
            <v-input :model-value="doctor?.lastName" readonly />
          </el-form-item>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <!-- <el-form-item label="Gender" prop="question">
            <v-select
              :model-value="doctor?.gender"
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
              :model-value="doctor?.dateOfBirth"
              value-format="YYYY-MM-DD"
              format="DD.MM.YYYY"
              @change="calculateAge"
              readonly
            />
          </el-form-item>
          <el-form-item :label="t('AGE')">
            <v-input :model-value="age"  readonly />
          </el-form-item>
          <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
            <v-input :model-value="doctor?.phone" v-mask="'+998 ## ### ## ##'" readonly />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('SPECIALITY')" prop="specialization">
            <v-input :model-value="doctor?.specialization" readonly />
          </el-form-item>
          <el-form-item :label="t('DEPARTMENT')" prop="departmentId" class="!mb-0">
            <v-select
              filterable
              v-model="doctor.departmentId"
              :options="departments"
              label-key="name"
              value-key="id"
              disabled
            />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input :model-value="dayjs(doctor?.creationDate).format('DD.MM.YYYY')" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input :model-value="doctor?.modifiedDate ? dayjs(doctor?.modifiedDate).format('DD.MM.YYYY'):''" :readonly="true" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('USERNAME')" prop="username">
            <v-input :model-value="doctor?.username" readonly />
          </el-form-item>

        </div>
        <!-- <el-form-item label="Address" class="!mb-0">
          <v-input v-model="form.value" type="textarea" :rows="4" />
        </el-form-item> -->
      </div>
      <div class="flex justify-end gap-3 w-full p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">{{t('CLOSE')}}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AxiosInstance } from "axios";
import type { IDoctorCreate } from "~/types/doctor/index.type";
import type { IDepartmentListItem } from "~/types/department/index.type";
import dayjs from "dayjs";
import { de } from "element-plus/es/locale/index.mjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; doctorId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const doctor = ref({
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  dateOfBirth: "",
  specialization: "",
  departmentId: undefined,
  roles: ["DOCTOR"],
  creationDate: "",
  modifiedDate: ""
})
const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);
const age = ref<any>("");
const formRef = ref<FormInstance>();

const getDoctorById = async () => {
  (<AxiosInstance>$axios).get(`/api/user/summary/${props.doctorId}`).then((res) => {
    doctor.value = res.data.payload;
    doctor.value.departmentId = res.data?.payload?.department?.id;
    departments.value.push(res.data.payload.department);
    calculateAge()
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
  const birthDate = new Date(doctor.value.dateOfBirth as string);
  const ageDifMs = today.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  age.value = Math.abs(ageDate.getUTCFullYear() - 1970);
};
onMounted(() => {
  getDepartments();
  if (props.doctorId) getDoctorById();
});
</script>

<style scoped></style>
