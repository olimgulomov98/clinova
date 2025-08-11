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
        v-if="percentage !== 0"
        class="py-[1px] px-1 rounded-md flex gap-[2px] items-center text-[10px] text-black leading-3"
        :class="down ? '!bg-[var(--color-red-20)]' : 'bg-[#D6EBF8]'"
      >
        <component :is="down ? IconTrendDown : IconTrendUp" />
        {{ down ? "-" : "+" }}{{ percentage.toFixed(2) }}%
      </p>
    </div>
    <p class="text-gray-20 text-[11px]">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import IconTrendUp from "@/components/IconTrendUp.vue";
import IconTrendDown from "@/components/IconTrendDown.vue";

withDefaults(
  defineProps<{
    title: string;
    count: number;
    percentage?: number;
    icon: string;
    text: string;
    down: boolean;
  }>(),
  {
    percentage: 0,
  }
);
</script>

<style scoped></style>
