<template>
  <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
    <div class="p-4 sm:p-6 grid custom-cols" v-loading="loading">
      <div>
        <div class="grid gap-x-16 grid-cols-2">
          <el-form-item :label="t('FULL_NAME')" prop="name">
            <v-input :disabled="!isEdit" v-model="form.name" />
          </el-form-item>
          <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
            <v-input
              :disabled="!isEdit"
              v-model="form.phone"
              v-mask="'+998 ## ### ## ##'"
            />
          </el-form-item>
          <el-form-item :label="t('BIRTH_DATE')" prop="dateOfBirth">
            <v-date-picker
              v-model="form.dateOfBirth"
              :disabled="!isEdit"
              value-format="YYYY-MM-DD"
              format="DD.MM.YYYY"
              @change="calculateAge"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item :label="t('GENDER')" prop="question">
            <div class="rounded-lg bg-gray-bg px-[5px] flex">
              <div v-for="gender in genders">
                <v-button
                  type="primary"
                  size="default"
                  :class="{ 'pointer-events-none opacity-50': !isEdit }"
                  v-if="form.gender == gender.value"
                  @click="form.gender = gender.value"
                >
                  {{ gender.label }}
                </v-button>
                <v-button
                  size="default"
                  :class="{ 'pointer-events-none opacity-50': !isEdit }"
                  v-if="form.gender !== gender.value"
                  @click="form.gender = gender.value"
                >
                  {{ gender.label }}
                </v-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="t('AGE')">
            <v-input :disabled="!isEdit" v-model="age" readonly />
          </el-form-item>

          <el-form-item :label="t('OCCUPATION')" prop="question">
            <v-input :disabled="!isEdit" v-model="form.occupation" />
          </el-form-item>
          <el-form-item :label="t('LEAD_SOURCE')">
            <v-input :disabled="!isEdit" v-model="form.source"/>
          </el-form-item>
        </div>
        <el-form-item :label="t('ADDRESS')" prop="address">
          <v-input :disabled="!isEdit" v-model="form.address" type="textarea" :rows="4" />
        </el-form-item>
      </div>
    </div>
    <div class="flex justify-end gap-3 w-full">
      <v-button
        v-if="isEdit"
        type="primary"
        size="xlarge"
        @click="submitForm(formRef)"
        class="!ml-0 min-w-[85px]"
        :loading="loading"
      >
        {{t('SAVE')}}
      </v-button>
      <v-button v-else type="primary" size="xlarge" @click="isEdit = true" class="!ml-0 min-w-[85px]">{{t('EDIT')}}</v-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
import type { FormInstance } from "element-plus";
import type { IPatientCreate } from "~/types/patient/index.type";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const route = useRoute();
const isEdit = ref(false);
const patientId = route.params?.patientId;
const rules = {
  // name: [{ required: true, message: "", trigger: "change" }],
  // dateOfBirth: [{ required: true, message: "", trigger: "change" }],
  // phone: [
  //   { required: true, message: "", trigger: "change" },
  //   { validator: phoneNumberValidator, message: "Please enter a valid phone number.", trigger: "blur" },
  // ],
  // address: [{ required: true, message: "", trigger: "change" }],
};
const genders = computed(() => {
  return [
    { label: t('MALE'), value: "MALE" },
    { label: t('FEMALE'), value: "FEMALE" },
  ];
});
const loading = ref(false);
const age = ref<any>("");
const form = reactive<Partial<IPatientCreate>>({
  name: "",
  dateOfBirth: "",
  address: "",
  phone: "",
  gender: "MALE",
  occupation: "",
  source: "",
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createPatient();
  });
};

async function createPatient() {
  loading.value = true;
  const id = patientId;
  const url = id ? `/api/patient/update` : "/api/patient/create";
  const method = id ? "put" : "post";
  (<AxiosInstance>$axios)
    [method](url, { ...form, id, phone: cleanPhoneNumber(form.phone || "") })
    .then((res) => {
      notificationShower("success", id ? t('PATIENT_UPDATE_SUCCESS') : t('PATIENT_CREATED_SUCCESS'));
      isEdit.value = false;
    })
    .finally(() => {
      loading.value = false;
      
    });
}

const getPatientById = async () => {
  loading.value = true;
  (<AxiosInstance>$axios)
    .get(`/api/patient/summary/${patientId}`)
    .then((res) => {
      form.name = res.data.payload.name;
      form.dateOfBirth = res.data.payload.dateOfBirth;
      form.address = res.data.payload.address;
      form.phone = res.data.payload.phone;
      form.gender = res.data.payload.gender;
      form.occupation = res.data.payload.occupation;
      form.source = res.data.payload.source;
      calculateAge();
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
  if (patientId) getPatientById();
});
</script>

<style scoped>
.custom-cols {
  grid-template-columns: 2fr 1fr;
}
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  background-color: white;
  border-color: #a7aaad !important;
}
:deep(.v-date-picker .el-input__wrapper) {
  background-color: white !important;
}
:deep(.el-form-item--label-top .el-form-item__label) {
  color: #757575;
}
</style>
