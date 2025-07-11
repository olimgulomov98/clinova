<template>
  <div>
    <el-drawer v-model="modelValue" size="100%"  :direction="'rtl'" :with-header="false" class="relative max-w-[400px]">
      <el-button class="default absolute top-5 p-0 right-5 z-50 shadow-md" @click="close">
        <icon-x class="w-4 h-4" />
      </el-button>
      <div>
        <Sidebar mobile-sidebar/>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();

const route = useRoute();
const close = () => {
  modelValue.value = false;
};

watch(
  () => route.path,
  () => close()
);
</script>

