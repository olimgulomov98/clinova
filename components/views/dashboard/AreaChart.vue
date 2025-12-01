<template>
  <VBlockCard v-loading="loading">
    <div class="flex justify-between items-center mb-4">
      <VBlockTitle>{{ t('REVENUE') }}</VBlockTitle>
      <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
            v-for="(btn, index) in options"
            :key="index"
            class="px-3 py-1 rounded-lg text-sm"
            :class="{ '!bg-[var(--color-blue-dark)] text-white': periodType === btn.value }"
            @click="changePeriod(btn.value)"
        >
          {{ t(btn.value) }}
        </button>
      </div>
    </div>
    <VChart :series="series" :categories="categories" type="bar" :legend="false"/>
  </VBlockCard>
</template>

<script setup>
const {t} = useI18n();
import {ref} from "vue";

const {$axios} = useNuxtApp();
const report_payment = ref({});
const loading = ref(false);
const periodType = ref('WEEK');
const chartKey = ref(0);
const colors = ["#ef4444", "#D6EBF8"]
const categories = computed(() => report_payment.value?.breakdown?.map(item => formatAutoDate(item.label) + ''));
const series = computed(() => {
  const breakdown = report_payment.value?.breakdown;
  return [
    {
      name: t('INCOME'),
      data: Array.isArray(breakdown) ? breakdown.map((i, index) => {
        const color = colors[index % 2];
        return {x: t('INCOME'), y: i.total, fillColor: color}
      }) : []
    }
  ];
});
const options = computed(() => [
  {
    label: t('WEEK'),
    value: 'WEEK',
  },
  {
    label: t('MONTH'),
    value: 'MONTH',
  },
  {
    label: t('YEAR'),
    value: 'YEAR'
  }
])

const changePeriod = (type) => {
  periodType.value = type;
  getReportPayment()
}
const getReportPayment = async () => {
  loading.value = true;
  $axios
      .get("/api/report/payment", {params: {periodType: periodType.value}})
      .then((res) => {
        report_payment.value = res?.data?.payload || {};
        chartKey.value++
      })
      .finally(() => {
        loading.value = false;
      });
};
onMounted(() => {
  getReportPayment();
})
</script>
