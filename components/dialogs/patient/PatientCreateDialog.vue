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
      <div
        class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line"
      >
        <v-form-title>{{
          patientId ? t("UPDATE_PATIENT") : t("ADD_NEW_PATIENT")
        }}</v-form-title>
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
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('FULL_NAME')" prop="name">
            <el-input
              v-model="form.name"
              class="form_input"
              :placeholder="t('ENTER_FULL_NAME')"
            />
          </el-form-item>
          <el-form-item :label="t('PHONE_NUMBER')" prop="phone">
            <el-input
              v-model="form.phone"
              class="form_input"
              v-mask="'+998 ## ### ## ##'"
              :placeholder="t('ENTER_PHONE_NUMBER')"
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
            <el-input
              type="date"
              v-model="form.dateOfBirth"
              class="form_input"
              value-format="YYYY-MM-DD"
              @change="calculateAge"
            />
            <!--            <el-date-picker-->
            <!--              v-model="form.dateOfBirth"-->
            <!--              value-format="YYYY-MM-DD"-->
            <!--              format="DD/MM/YYYY"-->
            <!--              v-mask="'##/##/####'"-->
            <!--              @input="onDateInput"-->
            <!--              @change="calculateAge"-->
            <!--              :disabled-date="disabledDate"-->
            <!--            />-->
          </el-form-item>
          <el-form-item :label="t('AGE')">
            <el-input
              v-model="age"
              class="form_input"
              :placeholder="t('AUTO_CALCULATED')"
              readonly
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('GENDER')" prop="question">
            <v-select
              v-model="form.gender"
              :options="genders"
              label-key="label"
              class="form_select"
              value-key="value"
              :placeholder="t('SELECT_GENDER')"
            ></v-select>
          </el-form-item>
          <el-form-item :label="t('OCCUPATION')" prop="question">
            <el-input
              v-model="form.occupation"
              class="form_input"
              :placeholder="t('ENTER_OCCUPATION')"
            />
          </el-form-item>
        </div>
        <el-form-item :label="t('ADDRESS')" prop="address">
          <el-input
            v-model="form.address"
            class="form_input"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item :label="t('LEAD_SOURCE')" class="!mb-0">
          <el-input v-model="form.source" class="form_input" />
        </el-form-item>
      </div>
      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <v-button type="default" size="xlarge" @click="emit('close')">{{
          t("CANCEL")
        }}</v-button>
        <v-button
          type="primary"
          size="xlarge"
          native-type="submit"
          class="!ml-0"
          :loading="loading"
        >
          {{ t("SAVE") }}
        </v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
import type { FormInstance } from "element-plus";
import type { IPatientCreate } from "~/types/patient/index.type";
import { useDateInput } from "~/composables/useDateInput";
const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  patientId?: number;
  defaultName?: string;
  defaultPhone?: string;
  appointmentId?: number;
}>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { phoneNumberValidator } = useValidators();
const { $axios } = useNuxtApp();
const { onDateInput } = useDateInput();
const router = useRouter();
const rules = {
  name: [{ required: true, message: "", trigger: "change" }],
  dateOfBirth: [{ required: true, message: "", trigger: "change" }],
  phone: [
    { required: true, message: "", trigger: "change" },
    {
      validator: phoneNumberValidator,
      message: t("VALID_PHONE"),
      trigger: "blur",
    },
  ],
  address: [{ required: true, message: "", trigger: "change" }],
};
const genders = computed(() => {
  return [
    { label: t("MALE"), value: "MALE" },
    { label: t("FEMALE"), value: "FEMALE" },
  ];
});
const loading = ref(false);
const age = ref<any>("");
const form = reactive<Partial<IPatientCreate>>({
  name: props.defaultName || "",
  dateOfBirth: "",
  address: "",
  phone: props.defaultPhone || "",
  gender: "",
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
  const id = props.patientId;
  const url = id ? `/api/patient/update` : "/api/patient/create";
  const method = id ? "put" : "post";

  try {
    const res = await (<AxiosInstance>$axios)[method](url, {
      ...form,
      id,
      phone: cleanPhoneNumber(form.phone || ""),
    });

    notificationShower(
      "success",
      id ? t("PATIENT_UPDATE_SUCCESS") : t("PATIENT_CREATED_SUCCESS")
    );

    if (!id && props.appointmentId) {
      try {
        await ($axios as AxiosInstance).post(
          `/api/appointment/change-status/${props.appointmentId}`,
          {},
          {
            params: {
              id: props.appointmentId,
              status: "COMPLETED",
            },
          }
        );
      } catch (err) {
        console.error("Appointment status update error:", err);
      }
    }

    emit("close");
    emit("getData");

    if (!id) {
      const newUrl = `/patients/${res.data.payload.id}?tab=profile`;
      const name = res.data.payload.code || `patient-${res.data.payload.id}`;

      useSetUrl({ name, url: newUrl });
      router.push(newUrl);
    }
  } catch (err) {
    console.error("Patient create/update error:", err);
    notificationShower("error", t("PATIENT_CREATE_FAILED"));
  } finally {
    loading.value = false;
  }
}

const getPatientById = async () => {
  (<AxiosInstance>$axios)
    .get(`/api/patient/summary/${props.patientId}`)
    .then((res) => {
      form.name = res.data.payload.name;
      form.dateOfBirth = res.data.payload.dateOfBirth;
      form.address = res.data.payload.address;
      form.phone = res.data.payload.phone;
      form.gender = res.data.payload.gender;
      form.occupation = res.data.payload.occupation;
      form.source = res.data.payload.source;
      calculateAge();
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
  if (props.patientId) getPatientById();
});
</script>

<style scoped></style>
