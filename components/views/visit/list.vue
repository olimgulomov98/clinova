<template>
  <div class="page-container !gap-6">
    <div class="flex w-full justify-between flex-wrap items-center">
      <teleport v-if="isMounted" to="#patient-tab-slot">
        <el-button
          type="primary"
          class="small_btn"
          @click="addVisit"
          v-if="hasPermission('patient', 'add_new_to_visit')"
        >
          <icon-plus />
          {{ t("ADD_NEW_VISIT") }}
        </el-button>
      </teleport>
    </div>
    <VTable
      :filters="filters"
      :table-data="tableData?.list"
      :loading="isLoading"
      @sort-change="sortChange"
      @search="search"
    >
      <template #tabs>
        <el-date-picker
          v-model="value2"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="
            border-radius: 8px;
            background: #f1d4d4;
            border: 0;
            height: 30px;
            width: 220px;
          "
          @update:model-value="onChangeDatePicker"
        />
        <el-form-item prop="statusId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.status"
            :options="statusOptions"
            class="filter_select"
            label-key="name"
            value-key="id"
            remote
            :placeholder="t('STATUS')"
            clearable
            :is-filter="true"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item prop="serviceId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.serviceId"
            :options="services"
            class="filter_select"
            label-key="name"
            value-key="id"
            :placeholder="t('SERVICE')"
            :remote-method="remoteServiceMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item prop="doctorId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.doctorId"
            :options="doctors"
            class="filter_select"
            label-key="name"
            value-key="id"
            :placeholder="t('DOCTOR')"
            :remote-method="remoteDoctorMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 120px"
          />
        </el-form-item>
      </template>
      <!-- <template #filter>
        <el-form-item prop="statusId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.status"
            :options="statusOptions"
            class="filter_select"
            label-key="name"
            value-key="id"
            remote
            placeholder="Status"
            clearable
            :is-filter="true"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item prop="serviceId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.serviceId"
            :options="services"
            class="filter_select"
            label-key="name"
            value-key="id"
            placeholder="Service"
            :remote-method="remoteServiceMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item prop="doctorId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.doctorId"
            :options="doctors"
            class="filter_select"
            label-key="name"
            value-key="id"
            placeholder="Doctor"
            :remote-method="remoteDoctorMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 120px"
          />
        </el-form-item>
      </template> -->
      <template #columns>
        <el-table-column prop="action" :label="t('ACTION')">
          <template #default="{ row }">
            <el-dropdown>
              <button class="p-3">
                <icon-dots />
              </button>
              <template #dropdown>
                <el-dropdown-menu class="!p-0">
                  <el-dropdown-item v-if="row.status !== 'COMPLETED'">
                    <button
                      @click="
                        handleDropClick(
                          `/patients/${route.params.patientId}/visit/${row.id}/diagnosis?tab=history`,
                          t('ADD_DIAGNOSIS')
                        )
                      "
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("WORKING_WITH_THE_PATIENT") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status !== 'COMPLETED'"
                    @click="addService(row.id)"
                  >
                    <button
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("ADD_NEW_SERVICE") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <button
                      @click="openFIleUpload(row.id)"
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("FILE_ATTACHMENT") }}
                    </button>
                  </el-dropdown-item>
                  <!--                  <el-dropdown-item>-->
                  <!--                    <button class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0">-->
                  <!--                      {{t('PRINT_INVOICE')}}-->
                  <!--                    </button>-->
                  <!--                  </el-dropdown-item>-->
                  <el-dropdown-item
                    v-if="hasPermission('patient', 'add_new_to_visit')"
                    @click="
                      handleDropClick(
                        `/patients/${route.params.patientId}/visit/${row.id}/summary?tab=history`
                      )
                    "
                  >
                    <button
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("SUMMARY") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status !== 'COMPLETED'"
                    @click="visitCompleteAction(row.id)"
                  >
                    <span
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("COMPLETE_VISIT") }}
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasPermission('patient', 'add_new_to_visit')"
                    @click="deleteVisit(row.id)"
                  >
                    <span
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("DELETE") }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column :label="t('CODE')">
          <template #default="{ row }">
            <div
              @click="
                handleDropClick(
                  `/patients/${route.params.patientId}/visit/${row.id}/summary?tab=history`,
                  row.code
                )
              "
              class="link-div"
            >
              {{ row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.name"
          :label="t('PATIENT_NAME')"
          :formatter="(row) => row.patient?.name"
        />
        <el-table-column :label="t('DEPARTMENT')">
          <template #default="{ row }">
            <ul class="flex flex-col flex-wrap gap-2">
              <li>
                <el-tooltip
                  class="box-item"
                  :disabled="row.items?.length < 2"
                  effect="dark"
                  placement="right-start"
                >
                  <template #content>
                    <ul>
                      <li v-for="(item, index) in row.items || []" :key="index">
                        <span>{{ item.doctor?.department?.name }}</span>
                      </li>
                    </ul>
                  </template>
                  <span>
                    {{ row.items?.[0]?.doctor?.department?.name || "----" }}
                  </span>
                </el-tooltip>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column :label="t('DOCTOR')">
          <template #default="{ row }">
            <ul class="flex flex-col flex-wrap gap-2">
              <li>
                <el-tooltip
                  class="box-item"
                  :disabled="row.items?.length < 2"
                  effect="dark"
                  placement="right-start"
                >
                  <template #content>
                    <ul>
                      <li v-for="(item, index) in row.items || []" :key="index">
                        <span>{{ item.doctor?.name }}</span>
                      </li>
                    </ul>
                  </template>
                  <span>
                    {{ row.items?.[0]?.doctor?.name || "----" }}
                  </span>
                </el-tooltip>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('VISIT_DATE')"
          :formatter="(row) => dayjs(row.startDate).format('YYYY-MM-DD HH:mm')"
        />
        <el-table-column prop="status" :label="t('STATUS')">
          <template #default="{ row }">
            <div v-if="row.status" class="status-btn">
              {{ t(row.status) }}
            </div>
          </template>
        </el-table-column>
      </template>
    </VTable>
    <VPagination
      v-model="filters"
      total-page-hide
      :total-page="tableData?.total"
      @update-query="updateQuery"
    />
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
    <FileUploadDialog
      v-if="isFileUploadVisible"
      v-model="isFileUploadVisible"
      @close="isFileUploadVisible = false"
      :visit-id="visitId"
      @get-data="getData"
    />
    <VisitCompletDialog
      v-if="isVisitCompleteVisible"
      v-model="isVisitCompleteVisible"
      @close="isVisitCompleteVisible = false"
      :visit-id="visitId"
      @get-data="getData"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { debounce } from "lodash";
import dayjs from "dayjs";
const { t } = useI18n();
const route = useRoute();
const { $axios } = useNuxtApp();
const isDoctorShowVisible = ref(false);
const isDoctorCreateVisible = ref(false);
const isFileUploadVisible = ref(false);
const isVisitCompleteVisible = ref(false);
const isMounted = ref(false);
const doctor = ref();
const services = ref([]);
const doctors = ref([]);
const isLoading = ref(false);
const loading = ref(false);
const router = useRouter();
const { hasPermission } = usePermission();
const visitId = ref<number | null>(null);
const value2 = ref([
  dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss[Z]"),
  dayjs().endOf(new Date()).format("YYYY-MM-DDTHH:mm:ss[Z]"),
]);
const statusOptions = ref([
  {
    name: t("NEW"),
    id: "NEW",
  },
  {
    name: t("COMPLETED"),
    id: "COMPLETED",
  },
]);
const filters = ref({
  searchKey: null,
  doctorId: null,
  orderBy: "status",
  desc: true,
  page: 1,
  size: 10,
  serviceId: null,
  patientId: route.params?.patientId,
  status: null,
  startDate: null,
  endDate: null,
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

    const response = await (<Axios>$axios).post("/api/visit/list", payload);
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

const remoteServiceMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 1) getServices(queryData);
}, 300);

const remoteDoctorMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 1) getDoctors(queryData);
}, 300);

const getServices = (queryData?: { searchKey: string }) => {
  loading.value = true;
  (<Axios>$axios)
    .post("/api/service/list", { ...queryData, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      services.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
};
const getDoctors = async (queryData: { searchKey?: string } = {}) => {
  loading.value = true;
  try {
    const response = await (<Axios>$axios).post<
      IBaseResponseModel<IDepartmentListItem[]>
    >("/api/user/list", {
      ...queryData,
      size: 500,
      role: "DOCTOR",
    });

    const list = response?.data?.payload?.list ?? [];
    doctors.value = list.map((item) => ({
      ...item,
      name: `${item.firstName ?? ""} ${item.lastName ?? ""} ${
        item.middleName ?? ""
      }`.trim(),
    }));
  } catch (error) {
    console.error("Failed to load doctors:", error);
    doctors.value = [];
  } finally {
    loading.value = false;
  }
};
const getStatusTheme = (status: string) => {
  switch (status) {
    case "NEW":
      return "success";
    case "COMPLETED":
      return "info";
  }
};
const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};
const search = (value: string) => {
  filters.value.searchKey = value;
};

const handleDropClick = (url: string, code?: string) => {
  if (code) useSetUrl({ name: code, url: url });
  router.push({
    path: url,
    query: { ...route.query },
  });
};
const openFIleUpload = (id: number) => {
  isFileUploadVisible.value = true;
  visitId.value = id;
};
const deleteVisit = async (id: number) => {
  try {
    isLoading.value = true;
    await (<Axios>$axios).delete(`/api/visit/${id}`);
    getData();
  } catch (error: any) {
    console.error("Failed to delete visit:", error?.message || error);
  } finally {
    isLoading.value = false;
  }
};
const visitCompleteAction = (id: number) => {
  isVisitCompleteVisible.value = true;
  visitId.value = id;
};
const onChangeDatePicker = (values: string[] | null) => {
  if (!values) {
    filters.value.startDate = null;
    filters.value.endDate = null;
    return;
  }
  filters.value.startDate = values[0];
  filters.value.endDate = values[1];
};
// hooks
const addVisit = () => {
  const url = `/patients/${route.params.patientId}/visit/create`;
  useSetUrl({ name: t("ADD_VISIT"), url: url });
  router.push(url);
};
const addService = (id: number) => {
  const url = `/patients/${route.params.patientId}/visit/${id}/service`;
  useSetUrl({ name: t("ADD_NEW_SERVICE"), url: url });
  router.push(url);
};
watch(filters.value, () => {
  getData();
});
watch(
  () => isFileUploadVisible.value,
  (newVal) => {
    if (!newVal) visitId.value = null;
  }
);
onMounted(() => {
  getData();
  getServices();
  getDoctors();
  isMounted.value = true;
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
  padding: 0 12px;
  font-size: 11px;
  color: #ef4444;
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: fit-content;
}
</style>
