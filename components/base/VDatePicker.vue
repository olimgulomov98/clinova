<template>
  <el-date-picker
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :style="{ width }"
    class="v-date-picker"
  ></el-date-picker>
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

<style lang="css">

.v-date-picker .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}
.v-date-picker .el-input__wrapper {
  background: var(--color-gray-light-bg) !important;
  border: 1px solid var(--color-gray-line);
  border-radius: 8px;
  box-shadow: none;
  height: 40px;
}
</style>
