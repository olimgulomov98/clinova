<template>
  <div class="flex-col flex gap-4">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ViewsDashboardStatisticCard
          v-loading="count_loading"
          :title="t('TOTAL_INVOICES')"
          :count="report_count?.invoice?.today || 0"
          :percentage="report_count?.invoice?.change"
          icon="users"
          :text="t('THIS_MONTH').replace('()',report_count?.invoice?.thisMonth || 0)"
          :down="report_count?.invoice?.change < 0"
      />
      <ViewsDashboardStatisticCard
          v-loading="count_loading"
          :title="t('TOTAL_PATIENTS')"
          :count="report_count?.visit?.today || 0"
          :percentage="report_count?.visit?.change"
          icon="user-circle"
          :text="t('THIS_MONTH').replace('()',report_count?.visit?.thisMonth || 0)"
          :down="report_count?.visit?.change < 0"
      />
      <ViewsDashboardStatisticCard
          v-loading="count_loading "
          :title="t('APPOINTMENTS')"
          :count="report_count?.appointment?.today || 0"
          :percentage="report_count?.appointment?.change"
          icon="calendar-check"
          :text="t('THIS_MONTH').replace('()',report_count?.appointment?.thisMonth || 0)"
          :down="report_count?.appointment?.change < 0"
      />
      <!--      <ViewsDashboardStatisticCard-->
      <!--          :title="t('BEDROOM')"-->
      <!--          :count="315"-->
      <!--          :percentage="1.64"-->
      <!--          icon="bed"-->
      <!--          text="56 more than yesterday"-->
      <!--          :down="false"-->
      <!--      />-->
    </div>
    <div class="grid md:grid-cols-2 gap-4 md:gap-5">
      <ViewsDashboardBarChart/>
      <ViewsDashboardAreaChart/>
    </div>
    <div class="grid-cols-2 grid gap-4 md:gap-5">
      <ViewsDashboardPieChart/>
      <ViewsDashboardDoctorSchule/>
    </div>
    <!--    <VBlockCard>-->
    <!--      <div class="flex justify-between">-->
    <!--        <VBlockTitle>{{ t('PATIENT_APPOINTMENT') }}</VBlockTitle>-->
    <!--        <el-date-picker type="date" :placeholder="t('PICK_DAY')"/>-->
    <!--      </div>-->
    <!--    </VBlockCard>-->
  </div>
</template>

<script setup lang="ts">
import type {Axios} from "axios";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const count_loading = ref(false);
const report_count = ref<any>({});

const getReportCount = async () => {
  count_loading.value = true;
  (<Axios>$axios)
      .get("/api/report/count")
      .then((res: any) => {
        report_count.value = res?.data?.payload || {}
      })
      .finally(() => {
        count_loading.value = false;
      });
};

onMounted(() => {
  getReportCount();
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
