<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[870px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="grid custom-grid-col border-b border-solid border-gray-line">
        <div class="px-6 py-4">
          <v-form-title>{{t('UPLOAD')}}</v-form-title>
        </div>
        <div class="border-l border-solid border-gray-line px-6 py-4">
          <v-form-title>{{t('UPLOAD_FILE')}}</v-form-title>
        </div>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="grid custom-grid-col">
        <div class="p-4 sm:p-6">
          <el-form-item>
            <VDragUpload
              v-model="form.multipartRequest"
              :multiple="true"
              :loading="loading"
              :disabled="loading"
              :uploadProgress="0"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            >
              <div class="flex flex-col items-center justify-center h-[300px] w-full relative">
                <icon-upload />
                <p class="absolute bottom-16 text-[#757575] text-lg">
                  {{t('DRAG_END_DROP_FILES')}}
                  <a href="#" class="text-[#2B95D6] font-semibold">{{t('BROWSE')}}</a>
                </p>
                <span class="absolute bottom-0 text-sm text-[#757575]">
                  {{t('YOU_CAN_DRAG')}}
                </span>
              </div>
            </VDragUpload>
          </el-form-item>
          <el-form-item prop="description" class="!mb-0">
            <v-input v-model="form.description" :placeholder="t('FILE_DESCRIPTION')" />
          </el-form-item>
        </div>
        <div class="border-l border-solid border-gray-line flex flex-col justify-between">
          <div class="max-w-full overflow-y-scroll h-[360px]">
            <ul class="flex flex-col w-full" v-if="form.multipartRequest.length > 0">
              <li
                v-for="(i, index) in form.multipartRequest"
                :key="index"
                class="p-[10px] border-b border-solid border-gray-line flex items-center gap-1"
              >
                <component :is="fileType(i.name)" class="w-9 h-10" />
                <span
                  class="text-lg text-blue-dark font-medium truncate max-w-full flex-1 min-w-0 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {{ i.name }}
                </span>
                <button class="flex-shrink-0" @click="removeFile(index)">
                  <icon-item-x />
                </button>
              </li>
            </ul>
            <div class="w-full h-[300px] flex items-center justify-center" v-else>
              <el-empty :description="t('NO_FILES_UPLOADED')" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-[10px] w-full p-4 sm:p-6 border-t border-solid border-gray-line">
            <v-button type="primary" size="xlarge" native-type="submit" class="!ml-0" :loading="loading">{{t('SAVE')}}</v-button>
            <v-button type="default" size="xlarge" @click="emit('close')">{{t('CANCEL')}}</v-button>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
import { remove } from "lodash";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; visitId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const rules = {
  multipartRequest: [{ required: true, message: "", trigger: "change" }],
  description: [{ required: true, message: "", trigger: "change" }],
};
const loading = ref(false);
const form = reactive<Partial<any>>({
  multipartRequest: [],
  description: "",
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    console.log("object", form);
    uploadFile();
  });
};
async function uploadFile() {
  const formData = new FormData();
  formData.append("description", form.description);
  form.multipartRequest.forEach((file: any) => {
    formData.append("multipartRequest[]", file.raw);
  });
  loading.value = true;
  const id = props.visitId;
  const url = `/api/attachment/visit/${id}`;
  const method = "post";
  (<Axios>$axios)
    [method](url, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => {
      notificationShower("success", t('UPLOADED_SUCCESS'));
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}
const removeFile = (index: number) => {
  remove(form.multipartRequest, (item, i) => i === index);
};

const fileType = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  return `icon-files-${ext}`;
};
</script>

<style scoped>
.custom-grid-col {
  grid-template-columns: 4fr 290px;
}
:deep(.el-upload-dragger) {
  border: none;
  padding: 0;
}
</style>
