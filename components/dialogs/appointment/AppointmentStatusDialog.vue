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
    <div class="p-6">
      <v-select
        v-model="status"
        :options="statuses"
        label-key="label"
        value-key="value"
        @change="updateStatus"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";

const props = defineProps<{ modelValue: boolean; appointmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);

const { $axios } = useNuxtApp();
const { t } = useI18n();

const statuses = useConstants().APPOINTMENTS_STATUSES?.map((i) => ({
  label: t(i),
  value: i,
}));

const status = ref("");

const updateStatus = async () => {
  if (!status.value || !props.appointmentId) return;
  try {
    await (<AxiosInstance>$axios).post(
      `/api/appointment/confirm/${props.appointmentId}`,
      {},
      {
        params: {
          id: props.appointmentId,
          confirm: status.value === "CONFIRMED",
        },
      }
    );
    notificationShower("success", t("STATUS_UPDATE_SUCCESS"));
    emit("getData");
    emit("close");
  } catch (e) {
    notificationShower("error", t("STATUS_UPDATE_FAILED"));
  }
};

onMounted(async () => {
  if (!props.appointmentId) return;
  const res = await (<AxiosInstance>$axios).get(
    `/api/appointment/summary/${props.appointmentId}`
  );
  status.value = res.data.payload.status;
});
</script>
