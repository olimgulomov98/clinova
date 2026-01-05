<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    width="476"
    class="!p-0"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-6 flex justify-between">
        <v-form-title>{{ t("DELETE") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <div class="flex justify-end gap-3 w-full p-6 pt-0">
      <v-button type="default" size="xlarge" @click="emit('close')">{{
        t("CANCEL")
      }}</v-button>
      <v-button
        type="primary"
        size="xlarge"
        @click="deleteStay"
        class="!ml-0"
        :loading="loading"
        >{{ t("DELETE") }}</v-button
      >
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AxiosInstance } from "axios";
const props = defineProps<{ modelValue: boolean; stayId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const { t } = useI18n();

const loading = ref(false);
async function deleteStay() {
  if (!props.stayId) return;
  loading.value = true;
  try {
    await (<AxiosInstance>$axios).delete(`/api/stay/${props.stayId}`);
    notificationShower("success", t("DATA_DELETE_SUCCESS"));
    emit("close");
    emit("getData");
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

<style scoped></style>
