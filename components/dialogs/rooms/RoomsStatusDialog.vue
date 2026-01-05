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
        <v-form-title>{{ t("CHANGE_BED_STATUS") }}</v-form-title>
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
        <el-form-item :label="t('BEDS')" prop="bedId">
          <v-select
            v-model="form.bedId"
            :options="bedOptions"
            label-key="label"
            value-key="value"
            class="form_select"
            :placeholder="t('SELECT_BED')"
          />
        </el-form-item>
        <el-form-item :label="t('BED_STATUS')" prop="status">
          <v-select
            v-model="form.status"
            :options="statusOptions"
            label-key="label"
            value-key="value"
            class="form_select"
            :placeholder="t('SELECT_STATUS')"
          />
        </el-form-item>
      </div>

      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <el-button
          type="default"
          class="large_btn large_cancel_btn"
          @click="emit('close')"
          >{{ t("CANCEL") }}</el-button
        >
        <el-button
          type="primary"
          size="large"
          native-type="submit"
          class="!ml-0 large_btn"
          :loading="loading"
        >
          {{ t("SAVE") }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  bedId?: number;
  room?: any;
}>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();

const statusOptions = [
  { label: t("FREE"), value: "FREE" },
  { label: t("OCCUPIED"), value: "OCCUPIED" },
  { label: t("CLEANING"), value: "CLEANING" },
  { label: t("BLOCKED"), value: "BLOCKED" },
];

const bedOptions = computed(() => {
  if (!props.room?.beds || !Array.isArray(props.room.beds)) {
    return [];
  }
  return props.room.beds.map((bed: any) => {
    const number = bed?.number || bed?.id || "";
    const status = bed?.status || "";
    const statusLabel = status ? t(status) : "";
    const label = status ? `${number} (${statusLabel})` : number;
    return {
      label,
      value: bed?.id || bed?.number || bed,
    };
  });
});

const rules = {
  bedId: [{ required: true, message: "", trigger: "change" }],
  status: [{ required: true, message: "", trigger: "change" }],
};

const loading = ref(false);
const form = reactive<{
  bedId: number | undefined;
  status: string;
}>({
  bedId: undefined,
  status: "",
});

const formRef = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    changeBedStatus();
  });
};

async function changeBedStatus() {
  const bedId = form.bedId || props.bedId;
  if (!bedId) return;

  // Ensure bedId is a number
  const bedIdNumber = typeof bedId === "number" ? bedId : Number(bedId);
  if (isNaN(bedIdNumber)) {
    notificationShower("error", t("ERROR_OCCURRED"));
    return;
  }

  loading.value = true;
  (<Axios>$axios)
    .post(
      `/api/room/bed/change-status/${bedIdNumber}`,
      {},
      {
        params: {
          status: form.status,
        },
      }
    )
    .then((res) => {
      notificationShower("success", t("BED_STATUS_UPDATE_SUCCESS"));
      emit("close");
      emit("getData");
      resetForm();
    })
    .catch((error) => {
      console.error("Error changing bed status:", error);
      const errorMessage =
        error?.response?.data?.message || t("ERROR_OCCURRED");
      notificationShower("error", errorMessage);
    })
    .finally(() => {
      loading.value = false;
    });
}

const getBedById = async () => {
  if (props.bedId && props.room?.beds) {
    const bed = props.room.beds.find(
      (b: any) => (b?.id || b?.number || b) === props.bedId
    );
    if (bed) {
      form.bedId = bed?.id || bed?.number || bed;
      form.status = bed?.status || "";
    }
  }
};

const resetForm = () => {
  form.bedId = undefined;
  form.status = "";
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.bedId) {
      getBedById();
      } else if (props.room?.beds && props.room.beds.length > 0) {
        // Auto-select first bed if no bedId provided
        const firstBed = props.room.beds[0];
        form.bedId = firstBed?.id || firstBed?.number || firstBed;
        form.status = firstBed?.status || "";
      }
    } else {
      resetForm();
    }
  }
);

watch(
  () => form.bedId,
  (newBedId) => {
    if (newBedId && props.room?.beds) {
      const bed = props.room.beds.find(
        (b: any) => (b?.id || b?.number || b) === newBedId
      );
      if (bed?.status) {
        form.status = bed.status;
      }
    }
  }
);

onMounted(() => {
  if (props.modelValue) {
    if (props.bedId) {
      getBedById();
    } else if (props.room?.beds && props.room.beds.length > 0) {
      const firstBed = props.room.beds[0];
      form.bedId = firstBed?.id || firstBed?.number || firstBed;
      form.status = firstBed?.status || "";
    }
  }
});
</script>

<style scoped></style>
