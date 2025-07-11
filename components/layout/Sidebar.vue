<template>
  <el-aside
    class="h-[100vh] flex flex-col justify-between app-sidebar p-5  md:p-5 sticky top-0 bg-[--color-gray-bg-sidebar]"
  >
    <div class="flex flex-col gap-5 ">
      <div class="flex gap-[10px] py-[10px]">
        <h4 class="overflow-hidden transition-all duration-300 font-semibold text-[22px] leading-[26px] w-full">
          <span class="flex gap-2 items-center cursor-pointer justify-center" @click="setToggleCollapse">
            <icon-logo-cyrcle class="w-[40px] h-[40px]" />
            <div class="flex flex-col" v-if="!isCollapse">
              <icon-logo-text class="w-[70px] h-[30px]" />
              <p class="whitespace-wrap text-[11px] leading-4 text-[#64748B]">Hospital Management System</p>
            </div>
            <!-- <icon-logo @click="setToggleCollapse"/> -->
            <!-- <div
              v-if="!isCollapse"
              class="logo-title"
            >
              WellNest
            </div> -->
          </span>
        </h4>
      </div>
      <el-menu class="el-menu-vertical-demo" :collapse="isCollapse">
        <template v-for="(nav, index) in useNavigations()" :key="index">
          <el-menu-item
            :index="`${index + 1}`"
            :class="{ 'is-active': $route.path == nav.to }"
            @click="router.push(nav.to)"
          >
            <el-icon><component :is="`icon-nav-${nav.icon}`" class="min-w-6 min-h-6" /></el-icon>
            <template #title>
              <div class="flex justify-between gap-1 w-full items-center relative">
                <p class="leading-5 min-w-[175px] max-w-[194px] text-wrap">{{ t(`${nav.title}`) }}</p>
              </div>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div  v-if="!isCollapse&&!mobileSidebar" class="language-content">
      <el-dropdown>
        <button
            class="bg-[--color-gray-bg-sidebar] gap-x-2 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
        >
          <div class="profile-name">
            {{ `${userInfo?.firstName} ${userInfo?.lastName}` }}
          </div>
          <icon-nav-caret-down />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="!p-0 w-50">
            <el-dropdown-item @click="logout">
              <div class="flex items-center text-base font-medium text-[--color-red-30] justify-between gap-x-2">
                <icon-sign-in />
                Log out
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <button
            class="bg-[--color-gray-bg-sidebar] gap-x-1 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
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
    </div>
  </el-aside>
</template>

<script lang="ts" setup>
const router = useRouter();
const store = useMainStore();
const isCollapse = ref(false);
const { t } = useI18n();
const { clearTokens } = useToken();
const userStore = useUserStore();
const { locale, setLocale } = useI18n();
const language = ref("Uzb");

const props = defineProps<{ mobileSidebar?: boolean }>();
const setToggleCollapse = () => {
  if (props?.mobileSidebar) return;
  isCollapse.value = !isCollapse.value;
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

watch(
  () => isCollapse.value,
  (value) => store.handleCollapse(value)
);
</script>

<style lang="css" scoped>
.el-aside {
  width: auto;
}
.app-sidebar::-webkit-scrollbar {
  width: 5px;
}
.app-sidebar::-webkit-scrollbar-track {
  border-radius: 10px;
}
.app-sidebar::-webkit-scrollbar-thumb {
  background: var(--color-brown);
  border-radius: 10px;
}

.app-sidebar {

  .language-content{
    position: fixed;
    left: 25px;
    bottom: 5px;
    display: flex;
    background: #F3F8FB;
    width: 200px;
    justify-content: space-between;

    .profile-name {
      color: #05080b;
      font-weight: 500;
      font-family: "SourceSans3", sans-serif;
      font-size: 15px;
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  background: #f3f8fb;
}
.app-sidebar .el-menu {
  border-right: none;
  background: #f3f8fb;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
}

.app-sidebar .el-menu-item {
  border-radius: 22px;
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--color-stone-600);
  background-color: var(--color-light-grey);
  font-weight: 500;
  min-height: 40px;
  padding: 12px 14px;
  gap: 0 8px;
  height: 40px;
}
.app-sidebar .el-sub-menu .el-sub-menu__title {
  border-radius: 8px;
  margin-bottom: 4px;
}
.app-sidebar .el-menu-item svg {
  color: var(--color-brown);
}
.app-sidebar .el-menu-item.is-active {
  background-color: var(--color-blue-light);
  color: var(--color-blue-dark);
}
.app-sidebar .el-menu-item.is-active svg {
  color: var(--color-blue-dark);
}

.logo-title {
  font-family: "SourceSans3", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #233955;
}

@media (min-width: 360px) and (max-width: 767px) {
  .language-content{
    display: none;
  }
}
</style>
