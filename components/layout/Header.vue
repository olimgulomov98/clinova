<template>
  <div>
    <div
      class="md:flex hidden border-[0] transition-[height] duration-200 ease-in-out page-header p-5 flex justify-between items-center bg-white"
    >
      <div id="header-content" />
      <span></span>
      <div class="flex gap-4 justify-end">
        <!-- <button class="bg-[--color-gray-bg-subtle] rounded-[12px] h-10 w-10 flex items-center justify-center">
          <icon-nav-gear-six />
        </button> -->
        <el-dropdown>
          <button
            class="bg-[--color-gray-bg-subtle] gap-x-1 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
          >
            <div class="profile-name">
              <icon-lang />
            </div>
          </button>
          <template #dropdown>
            <el-dropdown-menu class="!p-0">
              <el-dropdown-item
                v-for="(language, index) in useLanguages()"
                :key="index"
                :class="{ '!bg-pink': locale === language.value }"
                @click="setLanguage(language)"
              >
                <button
                  class="text-base flex gap-1 items-center font-medium text-gray-400 pb-0"
                  :class="{ '!text-brown ': locale === language.value }"
                >
                  {{ language.label }}
                </button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <button class="bg-[--color-gray-bg-subtle] rounded-[12px] h-10 w-10 flex items-center justify-center">
          <icon-nav-bell />
        </button> -->

      </div>
    </div>

    <div
      class="mobile-header border-[0] md:hidden transition-[height] duration-200 bg-[--color-gray-bg-subtle] ease-in-out p-5 flex justify-between items-center"
    >
      <el-dropdown>
        <button
          class="bg-[--color-gray-bg-subtle] gap-x-2 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
        >
          <div class="profile-name">
            {{ `${userInfo?.firstName} ${userInfo?.lastName}` }}
          </div>
          <icon-nav-caret-down />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="!p-0 w-50">
            <el-dropdown-item class="pointer-events-none">
              <div class="flex items-center text-base font-medium text-[--color-black] justify-between gap-x-2">
                <icon-user-circle />
                {{ userInfo?.username }}
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="pointer-events-none">
              <div class="flex items-center text-base font-medium text-[--color-black] justify-between gap-x-2">
                <icon-phone />
                {{ userInfo?.phone }}
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <div class="flex items-center text-base font-medium text-[--color-red-30] justify-between gap-x-2">
                <icon-sign-in />
                {{t('LOG_OUT')}}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <button
          class="bg-[--color-gray-bg-subtle] gap-x-1 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
        >
          <div class="profile-name">
            <icon-lang />
          </div>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="!p-0">
            <el-dropdown-item
              v-for="(language, index) in useLanguages()"
              :key="index"
              :class="{ '!bg-pink': locale === language.value }"
              @click="setLanguage(language)"
            >
              <button
                class="text-base flex gap-1 items-center font-medium text-gray-400 pb-0"
                :class="{ '!text-brown ': locale === language.value }"
              >
                {{ language.label }}
              </button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div>
        <button class="bg-[--color-gray-bg-subtle] h-10 w-10 flex items-center justify-center" @click="openSidebar">
          <icon-nav-list />
        </button>
      </div>
    </div>
    <MobileSidebar v-model="sidebarVisible" class="md:hidden" />
  </div>
</template>
<script setup lang="ts">
const { clearTokens } = useToken();
const { locale, setLocale } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const scrolling = ref(false);
const sidebarVisible = ref(false);
const { t } = useI18n();
const language = ref("Uzb");
const openSidebar = () => {
  sidebarVisible.value = true;
};

const logout = () => {
  clearTokens();
  router.push("/login");
};
const userInfo = computed(() => {
  return userStore.userInfo;
});

const setLanguage = (lang: { value: string; label: string }) => {
  setLocale(lang.value);
  language.value = lang.label;
};

onMounted(() =>
  addEventListener("scroll", () => (window.scrollY ? (scrolling.value = true) : (scrolling.value = false)))
);
</script>

<style lang="css" scoped>
.page-header {
  display: none;
  box-shadow: 0 0 18px #0000001a;

  .profile-name {
    color: #05080b;
    font-weight: 500;
    font-family: "SourceSans3", sans-serif;
    font-size: 15px;
  }
}

@media (min-width: 360px) and (max-width: 767px) {
  .page-header {
    display: none;
  }
  .mobile-header {
    display: flex;
  }
}

@media (min-width: 768px) and (max-width: 1600px) {
  .page-header {
    display: none;
  }
  .mobile-header {
    display: none;
  }
}
</style>
