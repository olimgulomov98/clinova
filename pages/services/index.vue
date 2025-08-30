<template>
  <div class="page-container">
    <div class="page-title">{{ t("SERVICES") }}</div>
    <VTable
      :filters="filters"
      :table-data="tableData?.list"
      :loading="isLoading"
      search-left-position
      @sort-change="sortChange"
      @search="search"
      search-class="filter-search filter-search_light"
    >
      <template #filter>
        <el-button
          type="primary"
          class="small_btn"
          @click="isServiceCreateVisible = true"
          >{{ t("ADD_NEW_SERVICE") }}</el-button
        >
      </template>
      <template #tabs>
        <el-form-item prop="departmentId" class="!mb-0">
          <v-select
            filterable
            class="filter_select"
            v-model="filters.departmentId"
            :options="departments"
            label-key="name"
            value-key="id"
            :placeholder="t('DEPARTMENT')"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 140px"
          />
        </el-form-item>
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
                      {{ t("VIEW") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item @click="editHandle(row)">
                    <button
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("EDIT") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <button
                      @click="deleteAction(row.id)"
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("DELETE") }}
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
          prop="price"
          :label="t('PRICE')"
          align="right"
          sortable
          :formatter="(row) => getFormatAmount(row.price)"
        />
        <el-table-column
          prop="department"
          :label="t('DEPARTMENT')"
          :formatter="(row) => row.department?.name"
        />
      </template>
    </VTable>
    <VPagination
      v-model="filters"
      total-page-hide
      :total-page="tableData?.total"
      @update-query="updateQuery"
    />
    <ServiceCreateDialog
      v-if="isServiceCreateVisible"
      v-model="isServiceCreateVisible"
      @close="isServiceCreateVisible = false"
      @getData="getData"
      :service-id="service?.id"
    />
    <ServiceShowDialog
      v-if="isServiceShowVisible"
      v-model="isServiceShowVisible"
      @close="isServiceShowVisible = false"
      :service-id="service?.id"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatAmount, getFormatDate } from "~/utils";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { debounce } from "lodash";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const isServiceShowVisible = ref(false);
const isServiceCreateVisible = ref(false);
const service = ref();
const isLoading = ref(false);
const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);

const filters = ref<any>({
  searchKey: null,
  departmentId: null,
  orderBy: null,
  desc: null,
  page: 1,
  size: 10,
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
      size: page_size || filters.value.size,
    };

    const response = await (<Axios>$axios).post("/api/service/list", payload);
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

const remoteMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 1) getDepartments(queryData);
}, 300);
const getDepartments = (queryData?: { searchKey: string }) => {
  loading.value = true;
  (<Axios>$axios)
    .post("/api/department/list", { ...queryData, showAll: true })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
};
const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};
const editHandle = (argService: any) => {
  isServiceCreateVisible.value = true;
  service.value = argService;
};

const showHandle = (argService: any) => {
  isServiceShowVisible.value = true;
  service.value = argService;
};
const deleteAction = (id: number) => {
  (<Axios>$axios).delete(`/api/service/${id}`).then((res) => {
    notificationShower("success", t("SERVICE_DELETED_SUCCESS"));
    getData();
  });
};
// hooks

watch(filters.value, () => {
  getData();
});
watch(
  () => isServiceCreateVisible.value,
  (val) => {
    if (!val) service.value = undefined;
  }
);
watch(
  () => isServiceShowVisible.value,
  (val) => {
    if (!val) service.value = undefined;
  }
);
onMounted(() => {
  getData();
  getDepartments();
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
