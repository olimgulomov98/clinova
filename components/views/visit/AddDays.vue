<template>
  <div class="relative">
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <div class="grid grid-cols-3 gap-6 mb-6">
        <el-form-item class="!mb-0" :label="t('STAY_ID')" prop="stayId">
          <v-input :model-value="stayId" disabled />
        </el-form-item>
        <el-form-item
          class="!mb-0"
          :label="t('ADDITIONAL_DAYS')"
          prop="additionalDays"
          required
        >
          <v-input v-model.number="form.additionalDays" type="number" />
        </el-form-item>
        <el-form-item class="!mb-0" :label="t('END_DATE')" prop="endDate">
          <v-date-picker v-model="form.endDate" format="DD.MM.YYYY" />
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end">
      <button
        @click="submitForm(formRef)"
        :class="{ 'pointer-events-none': loading }"
      >
        <v-button type="primary" size="xlarge" :loading="loading">{{
          t("SAVE")
        }}</v-button>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
import { dayjs } from "element-plus";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const tabStore = useUrlTabStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

const stayId = computed(() => route.params?.id);

const form = reactive({
  additionalDays: "" as string | number,
  endDate: "",
});

const rules: any = {
  additionalDays: [{ required: true, message: "", trigger: "change" }],
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    await addDays();
  });
};

async function addDays() {
  loading.value = true;
  try {
    const id = Number(stayId.value);
    const additionalDays = Number(form.additionalDays);

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("additionalDays", additionalDays.toString());

    if (form.endDate) {
      const endDate = dayjs(form.endDate).format("YYYY-MM-DD");
      queryParams.append("endDate", endDate);
    }

    await (<Axios>$axios).post(
      `/api/stay/add-days/${id}?${queryParams.toString()}`
    );
    notificationShower("success", t("DATA_SAVE_SUCCESS"));
    tabStore.removeUrl(route.fullPath);
    router.push(`/patients/${route.params?.patientId}?tab=stay`);
  } catch (error: any) {
    notificationShower(
      "error",
      error?.response?.data?.message || t("ERROR_OCCURRED")
    );
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  background-color: white !important;
  border-color: #a7aaad !important;
  border-width: 1px !important;
  height: 40px !important;
  min-height: 40px !important;
  box-shadow: none !important;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focused),
:deep(.el-select__wrapper.is-focus) {
  border-color: #a7aaad !important;
  box-shadow: 0 0 0 1px #a7aaad inset !important;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  color: #757575;
}

:deep(.el-input__inner),
:deep(.el-select__wrapper .el-select__selected-item) {
  height: 100% !important;
}
</style>
