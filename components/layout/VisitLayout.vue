<template>
  <div>
    <div class="flex justify-between">
      <VTab :options="options" @change="changeHandle" />
      <div id="patient-tab-slot" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const tabStore = useUrlTabStore();
const activeTab = ref("profile");
const { hasPermission } = usePermission();
const options = [
  {
    label: t("PATIENT_PROFILE"),
    value: "profile",
  },
  {
    label: t("VISIT_HISTORY"),
    value: "history",
  },
  {
    label: t("DOCUMENTS"),
    value: "documents",
  },
  ...(hasPermission("patient", "view_all_tabs_with_payments")
    ? [
        {
          label: t("PAYMENTS"),
          value: "invoices",
        },
      ]
    : []),
];
const changeHandle = (value: string) => {
  let oldUrl = route.fullPath;
  router
    .push({
      path: `/patients/${route.params.patientId}`,
      query: { tab: value },
    })
    .then(() => {
      tabStore.updateUrl(oldUrl, route.fullPath);
    });
};
onMounted(() => {
  if (route.query.tab) activeTab.value = route.query.tab;
  if (route.query.visitId) activeTab.value = "history";
});
</script>

<style scoped>
.active {
  background-color: #f3f8fbcc;
  border-bottom: 1px solid var(--color-blue-dark);
}
</style>
