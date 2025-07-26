<template>
  <DoctorLayout>
    <div class="page-container">
      <div class="bg-[#F3F8FB] -mx-4 p-4 rounded-xl">
        <VTable
          :filters="filters"
          :table-data="tableData?.list"
          :loading="isLoading"
          search-left-position
          :search-placeholder="t('SEARCH_NAME_ID_AGE_ETC')"
          @sort-change="sortChange"
          @search="search"
          search-class="filter-search filter-search_white"
        >
          <template #tabs>
            <el-form-item prop="departmentId" class="!mb-0">
              <v-select
                filterable
                v-model="filters.departmentId"
                :options="departments"
                label-key="name"
                class="filter_select filter_select_white"
                value-key="id"
                :placeholder="t('DEPARTMENT')"
                :remote-method="remoteMethod"
                :loading="loading"
                clearable
                :is-filter="true"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item prop="statusId" class="!mb-0">
              <v-select
                filterable
                v-model="filters.status"
                :options="statusOptions"
                class="filter_select filter_select_white"
                label-key="name"
                value-key="id"
                :placeholder="t('STATUS')"
                clearable
                :is-filter="true"
                style="width: 100px"
              />
            </el-form-item>
          </template>
          <template #filter>
            <el-button
              type="primary"
              class="small_btn"
              @click="isDoctorCreateVisible = true"
              >{{ t("ADD_DOCTOR") }}</el-button
            >
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
                      <!-- <el-dropdown-item @click="editStatusHandle(row)">
                      <button
                        class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                      >
                        {{ t("STATUS_CHANGE") }}
                      </button>
                    </el-dropdown-item> -->
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
            <el-table-column
              prop="fistName"
              :label="t('FULL_NAME')"
              :formatter="
                (row) => `${row?.firstName} ${row?.lastName} ${row.middleName}`
              "
            />
            <el-table-column prop="phone" :label="t('PHONE_NUMBER')" />
            <el-table-column
              prop="department"
              :label="t('DEPARTMENT')"
              :formatter="(row) => row.department?.name"
            />
            <el-table-column prop="specialization" :label="t('SPECIALITY')" />
            <el-table-column prop="status" :label="t('STATUS')">
              <template #default="{ row }">
                <el-select
                  v-model="row.status"
                  @change="(val) => updateStatus(row.id, val)"
                  size="small"
                  placeholder="Select"
                  class="custom-status-select"
                >
                  <el-option
                    v-for="status in ['AVAILABLE', 'NOT_AVAILABLE']"
                    :key="status"
                    :label="t(status)"
                    :value="status"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>
        </VTable>
        <VPagination
          class="mt-5"
          v-model="filters"
          total-page-hide
          :total-page="tableData?.total"
          @update-query="updateQuery"
        />
      </div>
      <DoctorCreateDialog
        v-if="isDoctorCreateVisible"
        v-model="isDoctorCreateVisible"
        @close="isDoctorCreateVisible = false"
        :doctor-id="doctor?.id"
        @get-data="getData"
      />
      <DoctorShowDialog
        v-if="isDoctorShowVisible"
        v-model="isDoctorShowVisible"
        @close="isDoctorShowVisible = false"
        :doctor-id="doctor?.id"
      />
      <DoctorStatusDialog
        v-if="isDoctorStatusVisible"
        v-model="isDoctorStatusVisible"
        @close="isDoctorStatusVisible = false"
        :doctor-id="doctor?.id"
        @get-data="getData"
      />
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatDate } from "~/utils";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { debounce } from "lodash";
import DoctorLayout from "~/components/layout/DoctorLayout.vue";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const isDoctorShowVisible = ref(false);
const isDoctorCreateVisible = ref(false);
const isDoctorStatusVisible = ref(false);
const doctor = ref();
const isLoading = ref(false);
const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);
const statusOptions = ref([
  {
    name: t("AVAILABLE"),
    id: "AVAILABLE",
  },
  {
    name: t("NOT_AVAILABLE"),
    id: "NOT_AVAILABLE",
  },
]);

const filters = ref<any>({
  role: "DOCTOR",
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

    const response = await (<Axios>$axios).post("/api/user/list", payload);
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
    .post("/api/department/list", { ...queryData })
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
const editHandle = (argDoctor: any) => {
  isDoctorCreateVisible.value = true;
  doctor.value = argDoctor;
};

const editStatusHandle = (argDoctor: any) => {
  isDoctorStatusVisible.value = true;
  doctor.value = argDoctor;
};

const showHandle = (argDoctor: any) => {
  isDoctorShowVisible.value = true;
  doctor.value = argDoctor;
};
const deleteAction = (id: number) => {
  (<Axios>$axios).delete(`/api/user/${id}`).then((res) => {
    notificationShower("success", t("DOCTOR_DELETED_SUCCESS"));
    getData();
  });
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "#2B95D6";
    case "NOT_AVAILABLE":
      return "#FD4245";
  }
};

const updateStatus = async (id: number, status: string) => {
  try {
    await (<Axios>$axios).post(
      `/api/user/status-change/${id}`,
      {},
      {
        params: {
          id,
          available: status === "AVAILABLE",
        },
      }
    );
    notificationShower("success", t("STATUS_UPDATE_SUCCESS"));
    getData();
  } catch (e) {
    notificationShower("error", t("STATUS_UPDATE_FAILED"));
  }
};

// hooks

watch(filters.value, () => {
  getData();
});
watch(
  () => isDoctorCreateVisible.value,
  (val) => {
    if (!val) doctor.value = undefined;
  }
);
watch(
  () => isDoctorShowVisible.value,
  (val) => {
    if (!val) doctor.value = undefined;
  }
);
watch(
  () => isDoctorStatusVisible.value,
  (val) => {
    if (!val) doctor.value = undefined;
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

.status-btn {
  font-family: "SourceSans3", sans-serif;
  font-size: 11px;
  font-weight: 400;
  width: fit-content;
  border-radius: 6px;
  padding: 3px 8px;
}
</style>
