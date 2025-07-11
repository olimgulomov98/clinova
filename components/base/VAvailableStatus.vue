<template>
  <div
    class="rounded-xl h-4 px-[10px] border border-solid inline-flex items-center"
    :class="status ? 'border-blue-light bg-blue-subtle' : 'border-red-30 bg-red-subtle'"
  >
    <p class="text-[10px]" :class="status ? 'text-blue-dark' : 'text-red-30'">
      {{ status ? t("AVAILABLE") : t('UNAVAILABLE') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
defineProps<{ status: boolean }>();
</script>

<style scoped></style>
