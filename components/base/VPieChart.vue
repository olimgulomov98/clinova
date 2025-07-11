<template>
  <VueApexCharts width="100%" height="300" type="pie" :options="chartOptions" :series="series"/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps<{
  series: number[];
  labels?: string[];
  colors?: string[];
}>();

const chartOptions = ref({
  chart: {
    type: "pie",
    toolbar: {show: false}
  },
  labels: props.labels || ["Male", "Female", "Other", "Unknown"],
  colors: props.colors || ["#233955", "#A2F2EE", "#4CAF50", "#FF9800"],
  dataLabels: {
    enabled: false,
    formatter: function (val: number) {
      return val.toFixed(1) + "%";
    },
    dropShadow: {
      enabled: false
    }
  },
  legend: {
    show: false
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val}`
    }
  },

  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Patients",
            formatter: () => props.series.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
});
</script>

<style scoped></style>
