<template>
  <div class="page-container">
      <div class="page-title">{{t('DEPARTMENTS')}}</div>
    <VTable
      :filters="filters"
      :table-data="tableData?.list"
      :loading="isLoading"
      search-left-position
      @sort-change="sortChange"
      @search="search"
    >
      <template #filter>
        <el-button type="primary" class="small_btn" @click="isDepartmentCreateVisible = true">{{t('ADD_NEW_DEPARTMENT')}}</el-button>
      </template>
      <template #columns>
        <el-table-column prop="action" :label="t('ACTION')">
          <template #default="{ row }">
            <el-dropdown>
              <button class="p-3">
                <icon-dots />
              </button>
              <template #dropdown>
                <el-dropdown-menu class="!p-0">
                  <el-dropdown-item>
                    <button
                      @click="showHandle(row)"
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{t('VIEW')}}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item @click="editHandle(row)">
                    <button class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full">
                      {{t('EDIT')}}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <button
                      @click="deleteAction(row.id)"
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{t('DELETE')}}
                    </button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="code" :label="t('CODE')" />
        <el-table-column prop="name" :label="t('NAME')" />
        <el-table-column
            prop="serviceCount"
            :label="t('SERVICE_COUNT')"
            align="right"
            :formatter="row => getFormatAmount(row.serviceCount)"
        />
        <el-table-column
            prop="doctorCount"
            :label="t('DOCTOR_COUNT')"
            align="right"
            :formatter="row => getFormatAmount(row.doctorCount)"
        />
        <el-table-column prop="description" :label="t('DESCRIPTION')"/>
      </template>
    </VTable>
    <VPagination v-model="filters" total-page-hide :total-page="tableData?.total" @update-query="updateQuery" />
    <DepartmentCreateDialog
      v-if="isDepartmentCreateVisible"
      v-model="isDepartmentCreateVisible"
      @close="isDepartmentCreateVisible = false"
      @getData="getData"
      :department-id="department?.id"
    />
    <DepartmentShowDialog
      v-if="isDepartmentShowVisible"
      v-model="isDepartmentShowVisible"
      @close="isDepartmentShowVisible = false"
      :department-id="department?.id"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import {getFormatAmount} from "~/utils";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const isDepartmentCreateVisible = ref(false);
const isDepartmentShowVisible = ref(false);
const department = ref();
const isLoading = ref(false);
const filters = ref<any>({
  searchKey: null,
  orderBy: null,
  desc: null,
  page: 1,
  size: 10
});

const tableData = ref<any>([]);
const { updateQuery, clearQuery } = useQuerySync(filters.value);

const getData = async () => {
  isLoading.value = true;
  try {
    const { page, page_size, ...restFilters } = filters.value;
    const payload = {
      ...restFilters,
      page: page - 1,
      size: page_size || filters.value.size
    };

    const response = await (<Axios>$axios).post("/api/department/list", payload);
    const data = response?.data?.payload;

    if (data) {
      tableData.value = data;
    } else {
      console.warn("No payload found in response:", response);
    }
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    isLoading.value = false;
  }
};

const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};
const editHandle = (argDepartment: any) => {
  isDepartmentCreateVisible.value = true;
  department.value = argDepartment;
};
const showHandle = (argDepartment: any) => {
  isDepartmentShowVisible.value = true;
  department.value = argDepartment;
};
const deleteAction = (id: number) => {
  (<Axios>$axios).delete(`/api/department/${id}`).then((res) => {
    notificationShower("success", t('DEPARTMENT_DELETED_SUCCESS'));
    getData();
  });
};
// hooks

watch(filters.value, () => {
  getData();
});
watch(
  () => isDepartmentCreateVisible.value,
  (val) => {
    if (!val) department.value = undefined;
  }
);
watch(
  () => isDepartmentShowVisible.value,
  (val) => {
    if (!val) department.value = undefined;
  }
);
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
.box-page {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  grid-gap: 20px;
  align-items: end;
}
</style>
