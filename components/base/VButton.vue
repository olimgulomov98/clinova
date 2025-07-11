<template>
  <el-button
    :size="mappedSize"
    :type="type"
    :class="{ 'el-button--xlarge': size === 'xlarge' }"
    v-bind="$attrs"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: "small" | "default" | "large" | "xlarge";
  type?: "primary" | "default";
}>();

const mappedSize = computed(() => (props.size === "xlarge" ? "large" : props.size));
</script>

<style scoped lang="scss">
.el-button--primary:hover {
  background-color: rgba(35, 57, 85, 0.5);
  border: 1px solid rgba(35, 57, 85, 0.1);
}
.el-button--primary,
.el-button--default {
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
}
.el-button--default {
  background: var(--color-gray-bg);
  border-color: var(--color-gray-bg);
}
.el-button--primary {
  background: var(--color-blue-dark);
}
.el-button--small {
  border-radius: 6px;
  padding: 3px 12px;
  font-size: 11px;
}
.el-button--default {
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  height: 32px;
}
.el-button--large {
  border-radius: 10px;
  padding: 8px 12px;
  height: 36px;
  font-size: 14px;
}

.el-button--xlarge {
  border-radius: 12px;
  padding: 10px 14px;
  height: 42px;
  font-weight: 600;
  font-size: 16px;
}
</style>
