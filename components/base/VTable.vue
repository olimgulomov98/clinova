<template>
  <div class="flex flex-col gap-5">
    <div class="flex justify-between w-full items-center gap-5 flex-wrap">
      <div class="flex gap-[10px] flex-wrap">
        <el-input
            :class="searchClass"
            v-if="!withOutSearch && searchLeftPosition"
            style="width: 223px"
            v-model="_value"
            :placeholder="searchPlaceholder"
        >
          <template #prefix>
            <icon-search class="text-gray-30" />
          </template>
        </el-input>
        <slot name="tabs"></slot>
      </div>
      <div class="flex gap-[10px] flex-wrap">
        <el-input
          :class="searchClass"
          v-if="!withOutSearch && !searchLeftPosition"
          style="width: 223px"
          v-model="_value"
          :placeholder="searchPlaceholder"
        >
          <template #prefix>
            <icon-search class="text-gray-30" />
          </template>
        </el-input>
        <slot name="filter"></slot>
      </div>
    </div>
    <div class="rounded-lg" style="border: 1px solid #e6e6e7; overflow: hidden">
      <el-table v-loading="loading" :border="border" :data="tableData" style="width: 100%" @sort-change="sortChange">
        <slot name="columns"></slot>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const emit = defineEmits(["sortChange", "search"]);
let debounceTimeout: NodeJS.Timeout | null = null;
const _value = ref<string | null>(null);

const props = withDefaults(
  defineProps<{
    tableData: any;
    loading: boolean;
    withOutSearch?: boolean;
    searchPlaceholder?: string;
    searchClass?: string;
    searchLeftPosition?: boolean;
    border?: boolean;
  }>(),
  {
    searchPlaceholder: 'Поиск ...',
    searchClass: "filter-search",
  }
);

const sortChange = ({ order, prop }: { order: string; prop: string }) => {
  const direction = order === "descending" ? false : order === "ascending" ? true : null;

  emit("sortChange", prop, direction);
};

watch(_value, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    emit("search", _value.value);
  }, 400);
});
</script>

<style lang="scss">
.el-table th.el-table__cell {
  background: #e6e6e7 !important;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}

.el-table th.el-table__cell {
  background: #f3f8fb !important;
  font-size: 11px !important;
  font-family: "SourceSans3", sans-serif !important;
  font-weight: 400 !important;
  color: #3a4e63 !important;
  line-height: 145% !important;
}

.el-table td.el-table__cell {
  font-size: 12px !important;
  font-family: "SourceSans3", sans-serif !important;
  font-weight: 400 !important;
  color: #05080b !important;
  line-height: 150% !important;
}

.el-table tr:hover {
  background: #eaf2f8 !important;
}
</style>
