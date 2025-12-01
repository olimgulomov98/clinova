<template>
  <div>
    <!-- <teleport v-if="isMounted" to="#header-content"> -->
    <ul class="flex items-center mb-5">
      <li>
        <nuxt-link
          to="/doctors"
          class="px-3 py-[6px] text-base"
          :class="{
            'active pointer-events-none': route.fullPath === '/doctors',
          }"
        >
          {{ $t("EMPLOYEE_LIST") }}
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
const tabStore = useDoctorTabStore();
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
const router = useRouter();

const removeAction = async (url: string) => {
  await tabStore.removeUrl(url);
  if (url === route.fullPath) router.back();
};
</script>

<style scoped>
.active {
  background-color: #f1d4d4;
  border-bottom: 1px solid var(--color-blue-dark);
}
</style>
