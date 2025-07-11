<template>
  <div>
    <!-- <div class="flex justify-between flex-col md:flex-row items-end gap-2">
      <span>
        <div class="px-[10px] h-10 flex items-center bg-[#EAF2F8] text-[#4B4D4F] text-[12px] rounded-lg">
          <p class="text-brown text-lg">Umumiy soni: {{ totalPage }}</p>
        </div>
      </span>
      <span class="hidden md:flex">
        <el-pagination
          v-model:current-page="modelValue.page"
          v-model:page-size="modelValue.page_size"
          :page-sizes="page_sizes"
          size="large"
          :background="true"
          layout="sizes, prev, pager, next"
          :total="totalPage || 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </span>
      <span class="md:hidden">
        <el-pagination
          v-model:current-page="modelValue.page"
          v-model:page-size="modelValue.page_size"
          :page-sizes="page_sizes"
          size="small"
          :background="true"
          layout="sizes, prev, pager, next"
          :total="totalPage || 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </span>
    </div> -->
    <div class="pagination-wrapper">
      <div class="left-controls flex gap-[10px] items-center">
        <div>
          <span class="text-[#87888A] text-xs">
            {{t('SHOWING')}} {{ modelValue.size > totalPage ? totalPage : modelValue.size }} {{t("OUT_OF")}} {{ totalPage || 0 }}
          </span>
        </div>
        <el-pagination
          size="small"
          v-model:page-size="modelValue.size"
          :page-sizes="page_sizes"
          layout="sizes"
          :total="totalPage || 0"
          @size-change="handleSizeChange"
        />
      </div>
      <div class="right-controls">
        <el-pagination
          size="small"
          v-model:current-page="modelValue.page"
          :page-sizes="page_sizes"
          layout="prev, pager, next"
          :total="totalPage || 0"
          @current-change="handleCurrentChange"
          :background="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const emit = defineEmits(["updateQuery"]);
const props = withDefaults(defineProps<{ totalPage?: number; totalPageHide?: boolean }>(), {
  totalPageHide: false,
  totalPage: 0,
});

const modelValue = defineModel() as Ref<{ page: number; size: number }>;
const page_sizes = [5, 10, 20, 30, 40, 50];

const handleSizeChange = (e: number) => {
  emit("updateQuery", true);
};
const handleCurrentChange = () => {
  emit("updateQuery", true);
};
</script>

<style lang="scss">
.el-pagination .el-select {
  width: 80px;
}
.el-pagination__sizes .el-select__wrapper {
  background: #eaf2f8 !important;
  height: 30px;
  min-height: 30px;
  padding: 6px;
}
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-controls,
.right-controls {
  display: flex;
  align-items: center;
}
.el-pagination__sizes .el-select-dropdown__item {
  display: flex;
}
.el-pagination__sizes .el-select__selected-item {
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
}
.el-pagination__sizes .el-select-dropdown__item {
  font-size: 0;
}

.el-pagination__sizes .el-select-dropdown__item::before {
  content: attr(title); /* el-option ichida raqam bor */
  font-size: 14px;
}
.el-pager li,
.el-pagination .btn-prev,
.el-pagination .btn-next {
  width: 30px;
  min-height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 8px !important;
  display: flex;
  justify-content: center;
}
.el-pagination .btn-prev i,
.el-pagination .btn-next i {
  width: 12px !important;
}
</style>
