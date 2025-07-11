<template>
  <el-input
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <template #prefix><slot name="prefix" /></template>
  </el-input>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    modelValue: any;
    width?: string;
  }>(),
  { width: "100%" }
);

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="css">
:deep(.el-textarea__inner.is-focus),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  background: var(--color-gray-light-bg);
  border: 1px solid var(--color-gray-line);
  border-radius: 8px;
  box-shadow: none;
}
:deep(.el-input__wrapper) {
  height: 40px;
}
</style>
