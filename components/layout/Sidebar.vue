<template>
  <el-aside
    class="h-[100vh] flex flex-col justify-between app-sidebar sticky top-0 bg-[#fff] border"
  >
    <div class="flex flex-col gap-5">
      <div class="flex gap-[10px] py-[10px] p-5 md:p-5">
        <h4
          class="overflow-hidden transition-all duration-300 font-semibold text-[22px] leading-[26px] w-full"
        >
          <span
            class="flex gap-2 items-center cursor-pointer justify-center"
            @click="setToggleCollapse"
          >
            <!-- <icon-logo-cyrcle class="w-[40px] h-[40px]" /> -->
            <div class="flex flex-col" v-if="!isCollapse">
              <!-- <icon-logo-text class="w-[70px] h-[30px]" /> -->
              <p class="whitespace-wrap leading-4 text-[22px] text-[#fd4245]">
                CLINOVA
              </p>
              <!-- <p class="whitespace-wrap text-[11px] leading-4 text-[#fd4245]">
                Hospital Management System
              </p> -->
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
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :default-openeds="['registration', 'accounting', 'company']"
      >
        <!-- 1. DASHBOARD -->
        <template v-if="groupedMenus.dashboard.length">
          <el-menu-item
            :index="groupedMenus.dashboard[0].to"
            :class="[
              'menu-dashboard',
              { 'is-active': $route.path === groupedMenus.dashboard[0].to },
            ]"
            @click="router.push(groupedMenus.dashboard[0].to)"
          >
            <el-icon>
              <component :is="`icon-nav-${groupedMenus.dashboard[0].icon}`" />
            </el-icon>
            <span>{{ t(groupedMenus.dashboard[0].title) }}</span>
          </el-menu-item>
        </template>

        <!-- 2. REGISTRATION -->
        <template v-if="groupedMenus.registration.length">
          <el-sub-menu index="registration">
            <template #title>
              <span class="flex items-center gap-3">
                <el-icon>
                  <component :is="`icon-nav-${sectionIcons.registration}`" />
                </el-icon>
                <span class="section-title-text">{{
                  t(sectionTitles.registration)
                }}</span>
              </span>
            </template>
            <el-menu-item
              v-for="(nav, index) in groupedMenus.registration"
              :key="`registration-${index}`"
              :index="nav.to"
              :class="{ 'is-active': $route.path === nav.to }"
              @click="router.push(nav.to)"
            >
              <span class="submenu-title"> - {{ t(nav.title) }} </span>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <!-- ✅ 3. EXTRA ITEM: PAYMENTS -->
        <template v-if="groupedMenus.payments.length">
          <el-menu-item
            :index="groupedMenus.payments[0].to"
            :class="[
              'menu-payments',
              { 'is-active': $route.path === groupedMenus.payments[0].to },
            ]"
            @click="router.push(groupedMenus.payments[0].to)"
          >
            <el-icon>
              <component :is="`icon-nav-${groupedMenus.payments[0].icon}`" />
            </el-icon>
            <span>{{ t(groupedMenus.payments[0].title) }}</span>
          </el-menu-item>
        </template>

        <!-- 4. ACCOUNTING -->
        <!-- <template v-if="groupedMenus.accounting.length"> -->
        <el-sub-menu index="accounting">
          <template #title>
            <span class="flex items-center gap-3">
              <el-icon>
                <component :is="`icon-nav-${sectionIcons.accounting}`" />
              </el-icon>
              <span class="section-title-text">
                {{ t(sectionTitles.accounting) }}
              </span>
            </span>
          </template>

          <el-menu-item
            v-for="(nav, index) in groupedMenus.accounting"
            :key="`accounting-${index}`"
            :index="nav.to"
            :class="{ 'is-active': $route.path === nav.to }"
            @click="router.push(nav.to)"
          >
            <span class="submenu-title"> - {{ t(nav.title) }} </span>
          </el-menu-item>
        </el-sub-menu>
        <!-- </template> -->

        <!-- 5. COMPANY -->
        <template v-if="groupedMenus.company.length">
          <el-sub-menu index="company">
            <template #title>
              <span class="flex items-center gap-3">
                <el-icon>
                  <component :is="`icon-nav-${sectionIcons.company}`" />
                </el-icon>
                <span class="section-title-text">{{
                  t(sectionTitles.company)
                }}</span>
              </span>
            </template>
            <el-menu-item
              v-for="(nav, index) in groupedMenus.company"
              :key="`company-${index}`"
              :index="nav.to"
              :class="{ 'is-active': $route.path === nav.to }"
              @click="router.push(nav.to)"
            >
              <span class="submenu-title"> - {{ t(nav.title) }} </span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    <div v-if="!isCollapse && !mobileSidebar" class="language-content">
      <el-dropdown>
        <button
          class="bg-[#fff] gap-x-2 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
        >
          <div class="profile-name">
            {{ `${userInfo?.firstName} ${userInfo?.lastName}` }}
          </div>
          <icon-nav-caret-down />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="!p-0 w-50">
            <el-dropdown-item @click="logout">
              <div
                class="flex items-center text-base font-medium text-[--color-red-30] justify-between gap-x-2"
              >
                <icon-sign-in />
                Log out
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <button
          class="bg-[#fff] gap-x-1 rounded-[12px] outline-0 h-10 px-2 flex items-center justify-between"
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
const navigations = useNavigations();

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

const sectionMap = {
  registration: ["APPOINTMENTS", "FOLLOW_UP", "PATIENTS", "DOCTOR_SCHEDULE"],
  accounting: ["REPORTS", "DOCTOR_SALARY", "CASHIER_REPORTS", "EXPENSES_LIST"],
  company: ["EMPLOYEE", "SERVICES", "DEPARTMENTS"],
};

const sectionTitles = {
  registration: t("Registration"),
  accounting: t("Accounting"),
  company: t("Company"),
};

const sectionIcons = {
  registration: "calendar-dots",
  accounting: "report",
  company: "hospital",
};

const groupedMenus = computed(() => {
  const result = {
    dashboard: [],
    payments: [],
    registration: [],
    accounting: [],
    company: [],
  };

  for (const item of navigations.value) {
    if (item.title === "DASHBOARD") {
      result.dashboard.push(item);
    } else if (item.title === "PAYMENTS") {
      result.payments.push(item);
    } else {
      for (const [section, titles] of Object.entries(sectionMap)) {
        if (titles.includes(item.title)) {
          result[section].push(item);
        }
      }
    }
  }

  return result;
});

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
  .language-content {
    position: fixed;
    left: 25px;
    bottom: 5px;
    display: flex;
    background: #fff;
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
  background: #fff;
}
/* SIDEBAR ORQA FON */
.app-sidebar .el-menu {
  border-right: none;
  background: #fff;
}

/* SUBMENU TUGMAGI */
.app-sidebar .el-sub-menu .el-sub-menu__title {
  padding: 6px 12px;
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-stone-600);
  border-radius: 4px;
}

.section-title-text {
  font-size: 16px;
  font-weight: 500;
  padding: 10px 0;
  /* color: #64748b; */
  margin: 0;
}

/* MENU ITEM */
.app-sidebar .el-menu-item {
  background: #fff;
  font-size: 16px;
  font-weight: 500;
  /* color: #999999; */
  gap: 12px;
  padding: 5px 0;
}

::v-deep(.submenu-title) {
  font-size: 15px;
  font-weight: 400;
  /* color: #a3a3a3; */
}

/* ACTIVE ITEM */
.app-sidebar .el-menu-item.is-active {
  color: var(--color-blue-light);
}

::v-deep(.el-menu-item.is-active .submenu-title) {
  color: var(--color-blue-light);
}

/* ICON STYLE */
.app-sidebar .el-menu-item .el-icon svg {
  /* color: #000; */
  width: 18px;
  height: 18px;
}

.app-sidebar .el-sub-menu__title svg {
  /* color: #000; */
  width: 18px;
  height: 18px;
}

/* NO COLLAPSE WIDTH */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  background: #fff;
}

/* SCROLLBAR */
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

.logo-title {
  font-family: "SourceSans3", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ef4444;
}

@media (min-width: 360px) and (max-width: 767px) {
  .language-content {
    display: none;
  }
}
</style>
