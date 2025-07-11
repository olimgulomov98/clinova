<template>
  <div class="flex-col flex gap-4">

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ViewsDashboardStatisticCard
          :title="t('TOTAL_INVOICES')"
          :count="1287"
          :percentage="2.14"
          icon="users"
          text="56 more than yesterday"
          :down="false"
      />
      <ViewsDashboardStatisticCard
          :title="t('TOTAL_PATIENTS')"
          :count="965"
          :percentage="3.78"
          icon="user-circle"
          text="45 more than yesterday"
          :down="false"
      />
      <ViewsDashboardStatisticCard
          :title="t('APPOINTMENTS')"
          :count="128"
          :percentage="1.56"
          icon="calendar-check"
          text="18 less than yesterday"
          :down="true"
      />
      <ViewsDashboardStatisticCard
          :title="t('BEDROOM')"
          :count="315"
          :percentage="1.64"
          icon="bed"
          text="56 more than yesterday"
          :down="false"
      />
    </div>
    <div class="grid md:grid-cols-2 gap-4 md:gap-5">
      <ViewsDashboardBarChart/>
      <ViewsDashboardAreaChart/>
    </div>
    <div class="custom-grid-cols-2 grid gap-4 md:gap-5">
      <ViewsDashboardPieChart/>
      <div>
        <ViewsDashboardDoctorSchule/>
      </div>
    </div>
    <VBlockCard>
      <div class="flex justify-between">
        <VBlockTitle>{{ t('PATIENT_APPOINTMENT') }}</VBlockTitle>
        <el-date-picker type="date" :placeholder="t('PICK_DAY')"/>
      </div>
    </VBlockCard>
  </div>
</template>

<script setup lang="ts">
import type {Axios} from "axios";
import type {IDepartmentListItem} from "~/types/department/index.type";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const loading = ref(false);
const report_count = ref<any>([]);
const getReportCount = async () => {
  loading.value = true;
  (<Axios>$axios)
      .get("/api/report/count")
      .then((res: any) => {
        report_count.value = res
      })
      .finally(() => {
        loading.value = false;
      });
};
onMounted(() => {
  getReportCount()
})
</script>

<style scoped>
.custom-grid-cols {
  grid-template-columns: 3fr 2fr;
}

.custom-grid-cols-2 {
  grid-template-columns: 5fr 3fr;
}

@media (max-width: 992px) {
  .custom-grid-cols-2 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .custom-grid-cols {
    grid-template-columns: 1fr;
  }

  .custom-grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
