<template>
  <div class="page-container">
    <div class="page-title">{{ t("APPOINTMENTS") }}</div>
    <VTable
      :filters="filters"
      :table-data="tableData?.list"
      :loading="isLoading"
      filter-right
      :search-placeholder="t('SEARCH_BY_NAME')"
      @sort-change="sortChange"
      @search="search"
    >
      <template #tabs>
        <div class="status-tab-group">
          <div v-for="tab in tabs">
            <div
              :class="
                activeTab !== tab.value ? 'item-group' : 'item-group-active'
              "
              @click="onChangeTabStatus(tab.value)"
            >
              {{ t(tab.code) }}
              <span v-if="tab.count > 0">{{
                ` (${getFormatAmount(tab.count)})`
              }}</span>
            </div>
          </div>
        </div>
        <!--        <el-form-item prop="serviceId" class="!mb-0">-->
        <!--          <v-select-->
        <!--            filterable-->
        <!--            v-model="filters.serviceId"-->
        <!--            :options="services"-->
        <!--            label-key="name"-->
        <!--            value-key="id"-->
        <!--            remote-->
        <!--            placeholder="Service"-->
        <!--            :remote-method="remoteServiceMethod"-->
        <!--            :loading="loading"-->
        <!--            clearable-->
        <!--            style="width: 240px"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item prop="doctorId" class="!mb-0">-->
        <!--          <v-select-->
        <!--            filterable-->
        <!--            v-model="filters.doctorId"-->
        <!--            :options="doctors"-->
        <!--            label-key="name"-->
        <!--            value-key="id"-->
        <!--            remote-->
        <!--            placeholder="Doctor"-->
        <!--            :remote-method="remoteDoctorMethod"-->
        <!--            :loading="loading"-->
        <!--            clearable-->
        <!--            style="width: 240px"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </template>
      <template #filter>
        <VDatePickerByBtnGroups @on-change-date-picker="onChangeDatePicker" />
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
          class="icon-date-picker"
          :class="{ 'date-picker-close': !!value2?.length }"
        />
        <el-button
          :disabled="!hasPermission('appointment', 'add')"
          class="small_btn"
          @click="isAppointmentCreateVisible = true"
          >{{ t("ADD_APPOINTMENT") }}</el-button
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
                  <el-dropdown-item @click="convertToPatient(row)">
                    <button
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("Convert_to_Patient") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasPermission('appointment', 'edit')"
                    @click="editHandle(row)"
                  >
                    <button
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("RESCHEDULE") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasPermission('appointment', 'delete')"
                  >
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
        <el-table-column prop="patientName" :label="t('PATIENT_NAME')" />
        <el-table-column prop="patientPhone" :label="t('PATIENT_PHONE')" />
        <el-table-column
          prop="time"
          :label="t('DATE')"
          sortable
          :formatter="(row) => getFormatDate(row.time)"
        />
        <el-table-column
          prop="time"
          :label="t('TIME')"
          sortable
          :formatter="(row) => getFormatDateTime(row.time)"
        />
        <el-table-column
          prop="doctor"
          :label="t('DOCTOR')"
          :formatter="(row) => row.doctor?.name"
        />
        <el-table-column
          prop="service"
          :label="t('SERVICE')"
          :formatter="(row) => row.service?.name"
        />
        <el-table-column prop="status" :label="t('STATUS')" sortable>
          <template #default="{ row }">
            <el-select
              v-model="row.status"
              @change="(val) => updateStatus(row.id, val)"
              size="small"
              placeholder="Select"
              class="custom-status-select"
              :disabled="!hasPermission('appointment', 'change_status')"
            >
              <!-- Agar status PENDING bo‘lsa, uni faqat SELECT ichida ko‘rsatish -->
              <el-option
                v-if="row.status === 'PENDING'"
                :label="t('PENDING')"
                :value="'PENDING'"
                disabled
              />

              <!-- Foydalanuvchi tanlay oladigan statuslar -->
              <el-option
                v-for="status in ['CONFIRMED', 'CANCELLED']"
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
      v-model="filters"
      total-page-hide
      :total-page="tableData?.total"
      @update-query="updateQuery"
    />
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
    <AppointmentStatusDialog
      v-if="isAppointmentStatusVisible"
      v-model="isAppointmentStatusVisible"
      @close="isAppointmentStatusVisible = false"
      :appointment-id="appointment?.id"
      @get-data="getData"
    />
    <PatientCreateDialog
      v-if="isPatientCreateVisible"
      v-model="isPatientCreateVisible"
      :appointment-id="appointment?.id"
      :default-name="appointment?.patientName"
      :default-phone="appointment?.patientPhone"
      @close="isPatientCreateVisible = false"
      @getData="getData"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatDate, getFormatDateTime } from "~/utils";
import type { IDepartmentListItem } from "~/types/department/index.type";
import { debounce } from "lodash";
import dayjs from "dayjs";

const { t } = useI18n();
const { $axios } = useNuxtApp();
const isAppointmentShowVisible = ref(false);
const isAppointmentCreateVisible = ref(false);
const appointment = ref();
const isLoading = ref(false);
const services = ref([]);
const doctors = ref([]);
const loading = ref(false);
const activeTab = ref(null);
const isAppointmentStatusVisible = ref(false);
const value2 = ref([]);
const isPatientShowVisible = ref(false);
const isPatientCreateVisible = ref(false);
const { hasPermission } = usePermission();
const userStore = useUserStore();
const roles = userStore.userRoles;
const userId = userStore.userInfo?.id || null;
const tabs = ref([
  {
    label: t("ALL"),
    code: "ALL",
    value: null,
    count: 0,
  },
  {
    label: t("CONFIRMED"),
    code: "CONFIRMED",
    value: "CONFIRMED",
    count: 0,
  },
  {
    label: t("PENDING"),
    code: "PENDING",
    value: "PENDING",
    count: 0,
  },
  {
    label: t("CANCELLED"),
    code: "CANCELLED",
    value: "CANCELLED",
    count: 0,
  },
]);

const filters = ref<any>({
  searchKey: null,
  departmentId: null,
  serviceId: null,
  doctorId: null,
  orderBy: null,
  type: null,
  startDate: null,
  endDate: null,
  desc: null,
  status: null,
  page: 1,
  size: 10,
});

const convertToPatient = (appointmentItem: any) => {
  appointment.value = appointmentItem;
  isPatientCreateVisible.value = true;
};

const tableData = ref<any>([]);
const { updateQuery, clearQuery } = useQuerySync(filters.value);

const getData = async () => {
  await getItemLengthByStatus();
  isLoading.value = true;

  try {
    const { page, page_size, ...restFilters } = filters.value;

    const payload: any = {
      ...restFilters,
      page: page - 1,
      size: page_size || filters.value.size,
    };

    if (roles.includes("DOCTOR") && userId) {
      payload.doctorId = userId;
    }

    const response = await (<Axios>$axios).post(
      "/api/appointment/list",
      payload
    );
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

const getServices = async (queryData?: { searchKey: string }) => {
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

const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};
const editHandle = (argService: any) => {
  isAppointmentCreateVisible.value = true;
  appointment.value = argService;
};

const deleteAction = (id: number) => {
  (<Axios>$axios).delete(`/api/appointment/${id}`).then((res) => {
    notificationShower("success", t("APPOINTMENT_DELETED_SUCCESS"));
    getData();
  });
};

const onChangeDatePicker = (values: string[]) => {
  filters.value.startDate = values?.[0] || null;
  filters.value.endDate = values?.[1] || null;
};

const onChangeTabStatus = (tab: string) => {
  filters.value.status = tab;
  activeTab.value = tab;
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "#3498db";
    case "PENDING":
      return "#f1c40f";
    case "CANCELLED":
      return "#e74c3c";
  }
};

const getItemLengthByStatus = async () => {
  const payload = {
    ...filters.value,
    status: null,
    page: 1,
    size: 100000,
  };

  if (roles.includes("DOCTOR") && userId) {
    payload.doctorId = userId;
  }

  const response = await (<Axios>$axios).post(
    "/api/appointment/statistics",
    payload
  );
  tabs.value[0].count = response.data.payload?.total;
  tabs.value[1].count = response.data.payload?.confirmed;
  tabs.value[2].count = response.data.payload?.pending;
  tabs.value[3].count = response.data.payload?.cancelled;
};

const editStatusHandle = (argAppointment: any) => {
  isAppointmentStatusVisible.value = true;
  appointment.value = argAppointment;
};

const updateStatus = async (id: number, status: string) => {
  try {
    await (<Axios>$axios).post(
      `/api/appointment/change-status/${id}`,
      {},
      {
        params: {
          id,
          status,
        },
      }
    );
    notificationShower("success", t("STATUS_UPDATE_SUCCESS"));
    getData(); // jadvalni yangilash
  } catch (e) {
    notificationShower("error", t("STATUS_UPDATE_FAILED"));
  }
};

// hooks

watch(filters.value, async () => {
  await getData();
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

watch(
  () => isAppointmentStatusVisible.value,
  (val) => {
    if (!val) appointment.value = undefined;
  }
);

watch(
  () => isPatientCreateVisible.value,
  (val) => {
    if (!val) appointment.value = undefined;
  }
);

onMounted(async () => {
  await getData();
  await getItemLengthByStatus();
  await getServices();
  await getDoctors();
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

.status-tab-group {
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: 8px;
  gap: 10px;
  padding: 2px;
  cursor: pointer;
  background: #f2f3f4;

  .item-group {
    padding: 0 14px;
    font-weight: 400;
    font-size: 12px;
    font-family: "SourceSans3", sans-serif;
    color: #4b4d4f;
    border-radius: 8px;
    gap: 0 4px;
  }

  .item-group-active {
    padding: 0 14px;
    font-weight: 400;
    font-size: 12px;
    font-family: "SourceSans3", sans-serif;
    color: white;
    border-radius: 8px;
    background: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 4px;
    height: 26px;
  }
}

.status-btn {
  padding: 1.5px 6px;
  font-size: 11px;
  color: #05080b;
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  border-radius: 4px;
  width: fit-content;
}
</style>
