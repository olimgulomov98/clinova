<template>
  <VBlockCard>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <VBlockTitle>Patient Overview</VBlockTitle>
        <p class="text-[10px] text-gray-20">by Departments</p>
      </div>
      <button>
        <icon-dots-three class="h-[30px] w-[30px]"/>
      </button>
    </div>
    <VPieChart :key="chartKey" :series="series" type="donut" :colors="colors" :labels="labels"/>
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
const colors = ["#233955", "#A2F2EE", "#DFF8F9", "#E6E6E7"];
const chartData = computed(() => report_department.value?.top?.map((item) => {
      return {
        label: item.name,
        seria: item.percentage
      }
    }
))
const series = computed(() => report_department.value?.top?.map((item) => item.count));
const labels = computed(() => report_department.value?.top?.map((item) => item.name));
const {$axios} = useNuxtApp();
const report_department = ref({});
const loading = ref(false);
const periodType = ref('WEEK');
const chartKey = ref(0);
const categories = computed(() => report_department.value?.breakdown?.map(item => item.label + ''));

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
      .get("/api/report/department", {params: {periodType: periodType.value}})
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
