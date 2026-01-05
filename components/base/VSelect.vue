<template>
  <el-select
    v-bind="$attrs"
    :model-value="modelValue"
    @change="emit('update:modelValue', $event), emit('change', $event)"
    :placeholder="placeholder"
    :style="{ width }"
    :readonly="readonly"
  >
    <template #label="{ label, value }" v-if="group">
      <span>{{ label }}:</span>
      <span style="font-weight: bold">{{ value }}</span>
    </template>
    <el-option-group
      v-if="group"
      v-for="(group, index) in options"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span
          style="
            float: right;
            color: var(--el-text-color-secondary);
            font-size: 13px;
          "
        >
          {{ item.value }}
        </span>
      </el-option>
    </el-option-group>
    <template v-else v-for="(item, index) in options" :key="index">
      <el-option :label="$t(item[labelKey])" :value="item[valueKey]" />
    </template>
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template v-if="isFilter" #prefix>
      <icon-filter class="text-gray-30" />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    group?: boolean;
    options: any[];
    modelValue: any;
    placeholder?: string;
    width?: string;
    label?: string;
    labelKey?: string;
    valueKey?: string;
    isLocale?: boolean;
    readonly?: boolean;
    isFilter?: boolean;
  }>(),
  {
    options: () => [],
    labelKey: "label",
    valueKey: "id",
    width: "100%",
    isLocale: true,
    group: false,
    readonly: false,
    isFilter: false,
  }
);
const emit = defineEmits(["update:modelValue", "change"]);
</script>

<style scoped lang="scss">
.el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}
.el-select-dropdown__item.is-selected {
  color: var(--color-primary);
}

:deep(.el-select__wrapper) {
  border-radius: 8px !important;
}
:deep(.el-select-group__title) {
  font-weight: 600;
  font-size: 16px;
  color: #000;
  background: var(--color-gray-bg-subtle);
}
.filter-select :deep(.el-select__wrapper) {
  background: #fff;
  min-height: 32px;
}

.el-select-dropdown__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 20px;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}
.loading-path .dot1 {
  transform: translate(3.75px, 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
}
.loading-path .dot2 {
  transform: translate(calc(100% - 3.75px), 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.4s;
}
.loading-path .dot3 {
  transform: translate(3.75px, calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 1.2s;
}
.loading-path .dot4 {
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.8s;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
