<template>
  <div>
    <!-- <teleport v-if="isMounted" to="#header-content"> -->
    <ul class="flex items-center mb-5">
      <li>
        <nuxt-link
          to="/patients"
          class="px-3 py-[6px] text-base"
          :class="{ 'active pointer-events-none': route.fullPath === '/patients' }"
        >
          {{ t("PATIENT_LIST") }}
        </nuxt-link>
      </li>
      <li v-for="(i, index) in tabStore.urls" :key="index">
        <nuxt-link
          class="px-3 py-[6px] text-base flex border-b border-solid border-[transparent] gap-1 items-center cursor-pointer"
          :to="i.url"
          :class="{ 'active ': route.fullPath === i.url }"
        >
          {{ i.name }}
          <button @click.stop.prevent="removeAction(i.url)">
            <icon-tab-x />
          </button>
        </nuxt-link>
      </li>
    </ul>
    <!-- </teleport> -->
    <slot />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const tabStore = useUrlTabStore();
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
const router = useRouter();

const removeAction = async (url: string) => {
  await tabStore.removeUrl(url);
  if (
    route.query?.tab &&
    [
      `/patients/${route.params?.patientId}?tab=profile`,
      `/patients/${route.params?.patientId}?tab=history`,
      `/patients/${route.params?.patientId}?tab=documents`,
    ].includes(route.fullPath + "")
  ) {
    router.push("/patients");
    return;
  }
  if (url === route.fullPath) router.back();
};
</script>

<style scoped>
.active {
  background-color: #f3f8fbcc;
  border-bottom: 1px solid var(--color-blue-dark);
}
</style>
