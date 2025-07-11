<template>
  <div class="flex flex-col gap-4 relative" v-loading="isLoading">
    <div class="flex justify-end gap-[10px] absolute right-4 top-4">
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
              @change="getData"
              style="width: 120px"
          />
        </el-form-item>
      <v-button type="primary" size="default" @click="isAppointmentCreateVisible = true">
        <icon-plus />
       {{t('ADD_APPOINTMENT')}}
      </v-button>
    </div>
    <VFullCalendar ref="calendarRef" :events="events" @handleEvent-id="handleEventId" @getData="getData" />
    <AppointmentCreateDialog
      v-if="isAppointmentCreateVisible"
      v-model="isAppointmentCreateVisible"
      @close="isAppointmentCreateVisible = false"
      :appointment-id="appointmentId"
      @get-data="getData"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios, AxiosInstance } from "axios";
import dayjs from "dayjs";
import { debounce } from "lodash";
import type { IDepartmentListItem } from "~/types/department/index.type";
import type { ICalendarEvent } from "~/types/time-grid-calendar.type";
const { t } = useI18n();
const calendarRef = ref<any>(null);
const isAppointmentCreateVisible = ref(false);
const appointmentId = ref<number>();
const isLoading = ref(true);
const loading = ref(false)
const doctors = ref([])
const { $axios } = useNuxtApp();
const filters = ref({
  startDate: "",
  endDate: "",
  doctorId: "",
  type: 'CALENDAR',
  role: "DOCTOR"
});
let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, "");
function createEventId() {
  return String(eventGuid++);
}

const events = ref<ICalendarEvent[]>([
  {
    id: createEventId(),
    title: "Dr. Emily Smith",
    start: todayStr + "T08:00:00",
    extendedProps: {
      // desc: "Chronic Disease Management for Hypertension with Patricia Clark",
      time: "04:00 PM",
      type: true
    },
    className: "custom-event"
  },
  {
    id: createEventId(),
    title: "Dr. Emily Smith",
    start: todayStr + "T08:00:00",
    extendedProps: {
      desc: "Chronic Disease Management for Hypertension with Patricia Clark",
      time: "04:00 PM",
      type: false
    },
    className: "custom-event"
  }
]);
const handleEventId = (id: number) => {
  appointmentId.value = id;
  isAppointmentCreateVisible.value = true;
};
const getData = async (filter?: { startDate?: string; endDate?: string }) => {
  try {
    isLoading.value = true;
    const response = await (<AxiosInstance>$axios).post("/api/appointment/list", {...filters.value, ...filter});
    const data = response?.data?.payload?.list || [];
    events.value = data.map((item: any, index: number) => {
      return {
        id: item?.id,
        title: item?.doctor?.name,
        start: item.time,
        extendedProps: {
          desc: "",
          time: dayjs(item.time).format("HH:mm A"),
          date: dayjs(item.time + '+05:00').format('DD.MM.YYYY HH:mm'),
          index: index,
          appointment: item
        },
        className: "custom-event"
      };
    });
  } finally {
    isLoading.value = false;
  }
};
const remoteDoctorMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getDoctors(queryData);
}, 300);
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
watch(
  () => isAppointmentCreateVisible.value,
  (val) => {
    if (!val) {
      appointmentId.value = undefined;
    }
  }
);
onMounted(() => {
  getDoctors();
  // getData();
});
</script>

<style scoped>
.filter-select :deep(.el-select__wrapper) {
  background: var(--color-gray-bg);
  min-height: 32px;
}

</style>
