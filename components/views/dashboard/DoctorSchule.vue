<template>
  <VBlockCard>
    <div class="flex justify-center items-center mb-4 relative">
      <div class="flex flex-col">
        <VBlockTitle>{{ t('PATIENT_OVERVIEW') }}</VBlockTitle>
        <p class="text-[10px] text-gray-20">{{ t('BY_SERVICES') }}</p>
      </div>
    </div>
    <VPieChart :key="chartKey" v-model="periodType" @change-period="changePeriod" :series="series" type="donut" :colors="colors" :labels="labels"/>
    <div class="flex flex-col gap-3 sm:gap-[14px]">
      <div class="flex justify-between items-center" v-for="(chart, index) in chartData">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full" :style="`background-color: ${colors[index]}`"></span>
          <span class="text-[12px]">{{ chart.label }}</span>
        </div>
        <p class="font-semibold text-xs text-gray-30">{{ chart.seria }}%</p>
      </div>
    </div>
  </VBlockCard>
</template>

<script setup>
import {ref} from "vue";

const {t} = useI18n();
const colors = ["#233955", "#A2F2EE", "#D6EBF8", "#E6E6E7"];
const chartData = computed(() => {
  const main = report_department.value?.top?.map((item) => {
    return {
      label: item.name,
      seria: item.percentage?.toFixed(0) || 0,
    };
  }) || [];
  const others = {
    label: t("OTHER_SERVICES"),
    seria: report_department.value?.others?.percentage?.toFixed(0) || 0,
  };
  return [...main, others] || [];
})
const series = computed(() => {
  const main = report_department.value?.top?.map((item) => item.count) || [];
  const others = report_department.value?.others?.count || 0;
  return [...main, others];
});
const labels = computed(() => {
  const main = report_department.value?.top?.map((item) => item.name) || [];
  const others = t("OTHER_SERVICES");
  return [...main, others];
});
const {$axios} = useNuxtApp();
const report_department = ref({});
const loading = ref(false);
const periodType = ref('WEEK');
const chartKey = ref(0);
const categories = computed(() => report_department.value?.breakdown?.map(item => item.label + ''));

const changePeriod = (type) => {
  periodType.value = type;
  getReportPayment()
}
const getReportPayment = async () => {
  loading.value = true;
  $axios
      .get("/api/report/service", {params: {periodType: periodType.value}})
      .then((res) => {
        report_department.value = res?.data?.payload || {};
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
