<template>
  <el-radio-group  :model-value="activeTab" style="height: 30px; border: 1px solid  #F0F0F0; border-radius: 8px" @change="emit('change', $event)">
    <el-radio-button v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </el-radio-button>
  </el-radio-group>
</template>

<script setup lang="ts">
defineProps<{ options: { label: string; value: string }[] }>();
const route = useRoute();
const emit = defineEmits(["change"]);
const activeTab = computed(() => {
  if (!route.query.tab) return "profile";
  return route.query.tab;
});
</script>

<style scoped lang="css">
:deep(.el-radio-button__inner) {
  border-radius: 8px !important;
  border: none !important;
  height: 28px;
  color: #4B4D4F;
  font-weight: 400;
  font-size: 12px;
  font-family: "SourceSans3", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px!important;
}
:deep(.el-radio-group) {
  border: 1px solid #a7aaad;
  border-radius: 8px;
}
</style>
