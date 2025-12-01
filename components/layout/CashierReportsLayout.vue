<template>
  <div>
    <ul class="flex items-center mb-5">
      <li>
        <nuxt-link
          to="/cashier-reports"
          class="px-3 py-[6px] text-base"
          :class="{
            'active pointer-events-none': route.fullPath === '/cashier-reports',
          }"
        >
          {{ $t("CASHIER_REPORTS") }}
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
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const tabStore = useCashierTabStore();

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
