<template>
  <el-config-provider :locale="el_locale">
    <div class="flex flex-col min-h-screen">
      <div class="app-layout flex justify-start flex-row">
        <Sidebar class="max-w-[240px] hidden md:flex" />
        <div class="flex flex-col w-full relative">
          <Header class="sticky top-0 z-50"  />
          <div class="flex-1 p-[28px] w-full">
            <NuxtPage class="h-full max-w-full mx-auto" />
          </div>
          <!--          <Footer class="mt-auto hidden md:flex" />-->
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import ru from "element-plus/dist/locale/ru.mjs";
import en from "element-plus/dist/locale/en.mjs";
import uz from "element-plus/dist/locale/uz-uz.mjs";
const { locale } = useI18n();
const { getUserInfo } = useLoginApi();
const el_locale = computed(() => {
  switch (locale.value) {
    case "uz":
      return uz;
    case "ru":
      return ru;
    case "en":
      return en;
    default:
      return uz;
  }
});
onMounted(() => {
  getUserInfo();
});
watchEffect(() => localStorage.setItem("lang", locale.value));
</script>
