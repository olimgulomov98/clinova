<template>
  <div>
    <el-table :data="props.visits?.items" :key="2" style="width: 99%">
      <template v-if="isStayInvoice">
        <el-table-column prop="room" :label="t('ROOM')">
          <template #default>{{ roomValue }}</template>
        </el-table-column>
        <el-table-column prop="bed" :label="t('BED')">
          <template #default>{{ bedValue }}</template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column
          prop="service"
          :label="t('SERVICE')"
          :formatter="(row: any) => row?.service?.name ?? '----'"
        />
      </template>
      <el-table-column
        prop="doctor"
        :label="t('DOCTOR_ASSIGNED')"
        :formatter="(row) => row.doctor?.name"
      />
      <el-table-column
        prop="department"
        :label="t('DEPARTMENT')"
        :formatter="(row) => row.service?.department?.name"
      />
      <el-table-column
        prop="quantity"
        :label="t('QUANTITY')"
        :formatter="(row) => getFormatAmount(row?.quantity)"
      />
      <el-table-column prop="discount" :label="t('DISCOUNT')">
        <template #default="{ row }">
          <div v-if="row?.discount">
            {{ getFormatAmount(row?.discount) }} <span>%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="t('PRICE')"
        :formatter="(row) => getFormatAmount(row?.price)"
      />
      <el-table-column
        prop="total"
        :label="t('TOTAL')"
        :formatter="(row) => getFormatAmount(row?.total)"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{ visits: any }>();

const isStayInvoice = computed(() => !props.visits?.visit && !!props.visits?.stay);

const roomValue = computed(() => {
  const stay = props.visits?.stay;
  if (!stay) return "----";
  return stay.room?.number ?? stay.room ?? "----";
});

const bedValue = computed(() => {
  const stay = props.visits?.stay;
  if (!stay) return "----";
  return stay.bed?.number ?? stay.bed ?? "----";
});
</script>

<style scoped>
:deep(.el-table th.el-table__cell) {
  background-color: white !important;
}

:deep(.el-table th) {
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #05080b;
}
:deep(tbody tr td) {
  border-right: 1px solid #f0f0f0 !important;
  border-top: 1px solid #f0f0f0 !important;
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #05080b;
}

:deep(tbody tr td .el-select__wrapper),
:deep(tbody tr td .el-input__wrapper) {
  box-shadow: none !important;
  border: 0 !important;
  background: transparent !important;
}
:deep(tbody tr td:first-child) {
  border-left: 1px solid #f0f0f0 !important;
}
</style>
