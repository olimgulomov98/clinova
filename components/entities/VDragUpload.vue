<template>
  <el-upload
    v-model:file-list="modelValue"
    :accept="accept"
    class="w-full"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    drag
    :show-file-list="false"
    :auto-upload="false"
    :disabled="disabled"
    :multiple="multiple"
    @change="handleFileChange"
  >
    <slot />
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadFile } from "element-plus";
interface IProp {
  modelValue?: File | null | string;
  loading: boolean;
  uploadProgress: number;
  fileUrl?: string;
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
}

withDefaults(defineProps<IProp>(), {
  modelValue: null,
  fileUrl: "",
  disabled: false,
  accept: "",
  multiple: false,
});
const emit = defineEmits(["update:modelValue", "cancel"]);
const modelValue = defineModel<any[]>("modelValue");
const fileObj = ref<File | null>(null);

const handleFileChange = (uploadFile: UploadFile) => {
  console.log("object", uploadFile);
  // const file = uploadFile.raw
  // if (file) {
  //   fileObj.value = file
  //   emit('update:modelValue', file)
  //   console.log(file)
  // }
};
</script>
<style lang="css" scoped>
:deep(.el-upload-dragger) {
  padding: 12px !important;
  border-color: #7367f0;
}
</style>
