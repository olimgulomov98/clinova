<template>
  <div class="page-container !gap-6">
    <div class="flex justify-between flex-wrap items-center">
      <div class="page-title">{{ t("FOLLOW_UP") }}</div>
        <!-- <el-button type="primary" class="small_btn" @click="isAppointmentCreateVisible = true">
          <icon-plus />
          {{ t("ADD_APPOINTMENT") }}
        </el-button> -->
    </div>
    <VTable
        :filters="filters"
        :table-data="tableData?.list"
        :loading="isLoading"
        @sort-change="sortChange"
        @search="search"
    >
      <template #tabs>
        <el-form-item prop="statusId" class="!mb-0">
          <v-select
              filterable
              v-model="filters.status"
              :options="statusOptions"
              label-key="label"
              value-key="id"
              class="filter_select"
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
              label-key="name"
              value-key="id"
              class="filter_select"
              remote
              :placeholder="t('SERVICE')"
              :remote-method="remoteServiceMethod"
              :loading="loading"
              clearable
              :is-filter="true"
              remote-show-suffix
              style="width: 120px"
          />
        </el-form-item>
        <el-form-item prop="doctorId" class="!mb-0">
          <v-select
              filterable
              v-model="filters.doctorId"
              :options="doctors"
              label-key="name"
              value-key="id"
              class="filter_select"
              remote
              :placeholder="t('DOCTOR')"
              :remote-method="remoteDoctorMethod"
              :loading="loading"
              clearable
              remote-show-suffix
              :is-filter="true"
              style="width: 120px"
          />
        </el-form-item>
      </template>
      <template #filter>
        <VDatePickerByBtnGroups @on-change-date-picker="onChangeDatePicker"/>
      </template>
      <template #columns>
        <el-table-column
            prop="visit.patient.code"
            :label="t('CODE')"
            :formatter="(row) => row.visit?.patient?.code"
        />
        <el-table-column
            prop="visit.patient.name"
            :label="t('PATIENT_NAME')"
            :formatter="(row) => row.visit?.patient?.name"
        />
        <el-table-column
            prop="visit.patient.phone"
            :label="t('PATIENT_PHONE')"
            :formatter="(row) => row.visit?.patient?.phone"
        />
        <el-table-column
            prop="time"
            :label="t('ASSIGNED_FOLLOW_UP_DATE')"
            sortable
            :formatter="(row) => getFormatDate(row?.date)"
        />
        <el-table-column prop="service" :label="t('SERVICE')" :formatter="(row) => row.service?.name" />
        <el-table-column
            prop="visit.startDate"
            :label="t('LAST_VISIT_DATE')"
            sortable
            :formatter="(row) => getFormatDate(row.visit?.startDate)"
        />
        <el-table-column
            prop="createdBy"
            :label="t('ASSIGNED_BY')"
            :formatter="(row) => row?.createdBy"
        />

        <el-table-column prop="status" :label="t('STATUS')" >
          <template #default="{ row }">
              <el-dropdown>
                <button class="p-3 outline-none">
                    <div
                        :style="`background:${getStatusTheme(row.status)}`"
                        class="status-btn"
                    >
                      {{ t(row.status) }}
                    </div>
                </button>
                <template #dropdown>
                  <el-dropdown-item @click="editStatusHandle(row)">
                    <button
                        class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{t('STATUS_CHANGE')}}
                    </button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
          </template>
        </el-table-column>
      </template>
    </VTable>
    <VPagination v-model="filters" total-page-hide :total-page="tableData?.total" @update-query="updateQuery" />
    <AppointmentCreateDialog
        v-if="isAppointmentCreateVisible"
        v-model="isAppointmentCreateVisible"
        @close="isAppointmentCreateVisible = false"
        :appointment-id="appointment?.id"
        @get-data="getData"
    />
    <AppointmentShowDialog
        v-if="isAppointmentShowVisible"
        v-model="isAppointmentShowVisible"
        @close="isAppointmentShowVisible = false"
        :appointment-id="appointment?.id"
    />
  <FollowUpChangeStatus
        v-if="isAppointmentStatusVisible"
        v-model="isAppointmentStatusVisible"
        @close="isAppointmentStatusVisible = false"
        :appointment-id="appointment?.id"
        @get-data="getData"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatDate } from "~/utils";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { debounce } from "lodash";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const isAppointmentShowVisible = ref(false);
const isAppointmentCreateVisible = ref(false);
const isAppointmentStatusVisible = ref(false);
const appointment = ref();
const isLoading = ref(false);
const services = ref([]);
const doctors = ref([]);
const loading = ref(false);
const route = useRoute();
const statusOptions = ref([
  {
    label: t("CONFIRMED"),
    id: "CONFIRMED",
  },
  {
    label: t("PENDING"),
    id: "PENDING",
  },
  {
    label: t("CANCELLED"),
    id: "CANCELLED",
  },
]);

const filters = ref<any>({
  searchKey: null,
  departmentId: null,
  serviceId: null,
  doctorId: null,
  orderBy: null,
  visitId: null,
  desc: null,
  page: 1,
  size: 10,
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

    const response = await (<Axios>$axios).post("/api/follow-up/list", payload);
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

const editStatusHandle = (argAppointment: any) => {
  isAppointmentStatusVisible.value = true;
  appointment.value = argAppointment;
};
const getDoctors = async (queryData: { searchKey?: string } = {}) => {
  loading.value = true;
  try {
    const response = await (<Axios>$axios).post<IBaseResponseModel<IDepartmentListItem[]>>("/api/user/list", {
      ...queryData,
      size: 500,
      role: "DOCTOR",
    });

    const list = response?.data?.payload?.list ?? [];
    doctors.value = list.map((item) => ({
      ...item,
      name: `${item.firstName ?? ""} ${item.lastName ?? ""} ${item.middleName ?? ""}`.trim(),
    }));
  } catch (error) {
    console.error("Failed to load doctors:", error);
    doctors.value = [];
  } finally {
    loading.value = false;
  }
};

const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "#2B95D6";
    case "PENDING":
      return "#FFE1E1";
    case "CANCELLED":
      return "#C3C4C4";
  }
};

const onChangeDatePicker = (values: string[] | null) => {
  filters.value.startDate = values[0];
  filters.value.endDate = values[1];
};
// hooks

watch(filters.value, () => {
  getData();
});
watch(
    () => isAppointmentCreateVisible.value,
    (val) => {
      if (!val) appointment.value = undefined;
    }
);
watch(
    () => isAppointmentShowVisible.value,
    (val) => {
      if (!val) appointment.value = undefined;
    }
);
onMounted(() => {
  getData();
  getServices();
  getDoctors();
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

.status-btn{
  padding: 4px 6px;
  font-size: 11px;
  color: #05080B;
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  border-radius: 4px;
  width: fit-content;
}

</style>
