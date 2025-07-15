<template>
  <div class="donut-chart-wrapper mx-auto">
    <VueApexCharts type="donut" width="300" :options="chartOptions" :series="series" />
    <div class="chart-center-content">
      <div class="dropdown">
        <select v-model="modelValue" @change="emit('change-period', modelValue)">
          <option v-for="option in options" :key="option.value" :value="option.value">
          {{option.label}}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
const emit = defineEmits(["change-period"]);
const modelValue = defineModel();
const props = defineProps<{
  series: number[];
  labels?: string[];
  colors?: string[];
}>();
const { t } = useI18n();
const options = computed(() => [
  {
    label: t("WEEK"),
    value: "WEEK",
  },
  {
    label: t("MONTH"),
    value: "MONTH",
  },
  {
    label: t("YEAR"),
    value: "YEAR",
  },
]);
const chartOptions = ref({
  chart: {
    type: "pie",
    toolbar: { show: false },
  },
  labels: props.labels || ["Male", "Female", "Other", "Unknown"],
  colors: props.colors || ["#233955", "#A2F2EE", "#4CAF50", "#FF9800"],
  dataLabels: {
    enabled: false,
    formatter: function (val: number) {
      return val.toFixed(1) + "%";
    },
    dropShadow: {
      enabled: false,
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val}`,
    },
  },

  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            fontSize: "11px",
            fontWeight: 500,
            color: "#666",
            label: "Overall",
            formatter: () => props.series.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
});
</script>

<style scoped>
.donut-chart-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
}

.chart-center-content {
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.overall {
  font-size: 14px;
  color: #555;
}

.total {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin: 4px 0;
}

.dropdown select {
  font-size: 14px;
  border: none;
  background: transparent;
  text-align: center;
  appearance: none;
  cursor: pointer;
}
:deep(.el-select__wrapper) {
  border-radius: 8px !important;
  padding-top: 0;
  border: 0;
  padding-bottom: 0;
  height: 20px;
  max-height: 20px;
  min-height: 20px;
  box-shadow: none;
}
:deep(.el-select__placeholder) {
  display: flex;
  justify-content: flex-end;
  font-weight: 400;
  font-size: 11px;
  line-height: 100%;
  letter-spacing: 1%;
  text-align: center;
  color: #3A4E63 !important;
}
</style>
