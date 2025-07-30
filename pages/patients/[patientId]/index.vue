<template>
  <PatientLayout>
    <VisitLayout>
      <component v-if="tabShowCondition" :is="activeComponent" />
    </VisitLayout>
  </PatientLayout>
</template>
<script setup lang="ts">
const { t } = useI18n();
import {
  ViewsPatientDetail,
  ViewsVisitDocuments,
  ViewsVisitList,
  ViewsVisitPayments,
} from "#components";

const route = useRoute();
const options = [
  {
    label: t("PATIENT_PROFILE"),
    value: "profile",
    component: ViewsPatientDetail,
  },
  {
    label: t("VISIT_HISTORY"),
    value: "history",
    component: ViewsVisitList,
  },
  {
    label: t("DOCUMENTS"),
    value: "documents",
    component: ViewsVisitDocuments,
  },
  {
    label: t("PAYMENTS"),
    value: "invoices",
    component: ViewsVisitPayments,
  },
];
const activeComponent = computed(
  () =>
    options.find((item) => item.value === route.query.tab)?.component ||
    options[0].component
);
const tabShowCondition = computed(
  () => activeComponent && !route.query?.visitId
);
</script>
