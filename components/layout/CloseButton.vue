<template>
  <el-button class="default flex !justify-start">
    <icon-nav-close class="transition-all duration-500 text-brown" :class="{ 'rotate-180': isCollapse }" />
    <span v-if="!isCollapse">{{t('CLOSE')}}</span>
  </el-button>
</template>
<script lang="ts" setup>
const { t } = useI18n();
defineProps<{ isCollapse: boolean }>();
</script>
