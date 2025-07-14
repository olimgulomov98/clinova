<template>
  <VBlockCard v-loading="loading">
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <VBlockTitle>{{ t('PATIENT_OVERVIEW') }}</VBlockTitle>
        <p class="text-[10px] text-gray-20">{{ t('BY_AGE_STAGES') }}</p>
      </div>
      <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <v-select class="min-w-[100px]" :options="options" label-key="label"
                  value-key="value" v-model="periodType" :placeholder="t('SELECT')" @change="changePeriod"/>
      </div>
    </div>
    <VChart :key="chartKey" :series="series" type="bar" :colors="colors" :categories="categories"/>
  </VBlockCard>
</template>

<script setup>
import {ref} from "vue";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const loading = ref(false);
const report_age = ref({});
const periodType = ref('WEEK');
const chartKey = ref(0)
const colors = ["#233955", "#D6EBF8", "#D6EBF8"];
const categories = computed(() => report_age.value?.breakdown?.map(item => formatAutoDate(item.label) + ''));
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
const series = computed(() => [
  {
    name: t('CHILD'),
    data: report_age.value?.breakdown?.map(item => item.child) || []
  },
  {
    name: t('ADULT'),
    data: report_age.value?.breakdown?.map(item => item.adult) || []
  },
  {
    name: t('ELDERLY'),
    data: report_age.value?.breakdown?.map(item => item.elderly) || []
  }
]);
const changePeriod = () => {
  getReportAge()
}
const getReportAge = async () => {
  loading.value = true;
  ($axios)
      .get("/api/report/age", {params: {periodType: periodType.value}})
      .then((res) => {
        report_age.value = res?.data?.payload || {};
        chartKey.value++
      })
      .finally(() => {
        loading.value = false;
      });
};
onMounted(() => {
  getReportAge();
})
</script>
<style scoped>
:deep(.el-select__wrapper) {
  background-color: var(--color-blue-dark);
  min-height: 30px;
  padding: 3px 10px;
}

:deep(.el-select__selected-item) {
  color: white;
  font-size: 12px;
}
</style>