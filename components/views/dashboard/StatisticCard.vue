<template>
  <div class="border border-solid border-gray-line rounded-2xl p-3">
    <div class="flex justify-between mb-4">
      <p class="flex items-center gap-[6px] text-gray-30 text-xs">
        <component :is="`icon-${icon}`" class="text-gray-20" />
        {{ title }}
      </p>
    </div>
    <div class="flex justify-between items-center mb-[6px] h-6">
      <h5 class="font-semibold text-[22px] text-black">{{ count }}</h5>
      <p
        class="py-[1px] px-1 rounded-md flex gap-[2px] items-center text-[10px] text-black leading-3"
        :class="down ? 'bg-red-20' : 'bg-blue-light'"
      >
        <icon-trend-up />
        {{ down ? "-" : "+" }}{{ percentage }}%
      </p>
    </div>
    <p class="text-gray-20 text-[11px]">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; count: number; percentage: number; icon: string; text: string; down: boolean }>();
</script>

<style scoped></style>
