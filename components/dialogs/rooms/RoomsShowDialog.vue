<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[700px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div
        class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line"
      >
        <v-form-title>{{ t("ROOM_INFO") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top">
      <div class="p-4 sm:p-6">
        <el-form-item :label="t('ROOM_NUMBER')">
          <v-input :model-value="roomData?.number" :readonly="true" />
        </el-form-item>
        <div class="grid sm:grid-cols-3 sm:gap-4">
          <el-form-item :label="t('BEDS')">
            <v-input
              :model-value="
                Array.isArray(roomData?.beds)
                  ? roomData.beds
                      .map((bed: any) => {
                        const number = bed?.number || bed?.id || '';
                        const status = bed?.status || '';
                        const statusLabel = status ? t(status) : '';
                        return status ? `${number} (${statusLabel})` : number;
                      })
                      .join(', ')
                  : roomData?.beds || ''
              "
              :readonly="true"
            />
          </el-form-item>
          <el-form-item :label="t('PRICE')">
            <v-input :model-value="roomData?.price" :readonly="true" />
          </el-form-item>
          <el-form-item :label="t('RELATED_DEPARTMENT')" prop="departmentId">
            <v-input
              :model-value="roomData?.department?.name"
              :readonly="true"
            />
          </el-form-item>
        </div>
        <div class="grid sm:grid-cols-2 sm:gap-4">
          <el-form-item :label="t('CREATED_DATE')">
            <v-input
              :model-value="
                roomData?.creationDate
                  ? dayjs(roomData?.creationDate).format('DD.MM.YYYY')
                  : ''
              "
              :readonly="true"
            />
          </el-form-item>
          <el-form-item :label="t('MODIFIED_DATE')">
            <v-input
              :model-value="
                roomData?.modifiedDate
                  ? dayjs(roomData?.modifiedDate).format('DD.MM.YYYY')
                  : ''
              "
              :readonly="true"
            />
          </el-form-item>
        </div>
      </div>
      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <v-button type="default" size="xlarge" @click="emit('close')">{{
          t("CLOSE")
        }}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import dayjs from "dayjs";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; roomId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const roomData = ref();
const loading = ref(false);

const getRoomById = async () => {
  if (!props.roomId) return;
  loading.value = true;
  (<Axios>$axios)
    .get(`/api/room/summary/${props.roomId}`)
    .then((res) => {
      roomData.value = res.data.payload;
    })
    .catch((error) => {
      console.error("Error fetching room data:", error);
      notificationShower(
        "error",
        error?.response?.data?.message || t("ERROR_OCCURRED")
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.roomId) {
      getRoomById();
    }
  }
);

onMounted(() => {
  if (props.roomId) getRoomById();
});
</script>

<style scoped></style>
