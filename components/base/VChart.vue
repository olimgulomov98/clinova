<template>
  <VueApexCharts width="100%" height="300" :type="type" :options="chartOptions" :series="series"/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = withDefaults(
    defineProps<{
      legend?: boolean
      series: any[];
      categories?: any;
      colors?: any;
      type?: string;
    }>(),
    {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      colors: ["#233955", "#A2F2EE"],
      type: "line",
      legend: true
    }
);

const chartOptions = computed(() => {
  return {
    chart: {
      toolbar: {show: false},
      zoom: {enabled: false}
    },
    stroke: {
      curve: "smooth",
      width: props.type === "bar" ? 0 : 3
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: "end",
        columnWidth: "50%",
        endingShape: "flat"
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: props.colors,
    xaxis: {
      categories: props.categories
    },
    yaxis: {
      // min: 0,
      // max: 1600,
      tickAmount: 4
    },
    markers: {
      size: 5,
      colors: props.colors,
      strokeColors: props.colors,
      strokeWidth: 3
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => val
      }
    },
    legend: {
      show: props.legend,
      position: "top",
      horizontalAlign: "left",
      markers: {
        width: 12,
        height: 12,
        shape: 'circle',
      },
    },
    grid: {
      strokeDashArray: 4
    }
  }
});
</script>

<style scoped></style>
