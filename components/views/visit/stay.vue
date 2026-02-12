<template>
  <div class="page-container !gap-6">
    <div class="flex w-full justify-between flex-wrap items-center">
      <teleport v-if="isMounted" to="#patient-tab-slot">
        <el-button
          type="primary"
          class="small_btn"
          @click="addStay"
          v-if="hasPermission('patient', 'add_new_to_visit')"
        >
          <icon-plus />
          {{ t("ADD_NEW_STAY") }}
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
        <el-form-item prop="roomId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.roomId"
            :options="rooms"
            class="filter_select"
            label-key="number"
            value-key="id"
            :placeholder="t('ROOM_NUMBER')"
            :remote-method="remoteRoomMethod"
            :loading="loading"
            clearable
            :is-filter="true"
            style="width: 120px"
            @change="onRoomChange"
          />
        </el-form-item>
        <el-form-item prop="bedId" class="!mb-0">
          <v-select
            filterable
            v-model="filters.bedId"
            :options="bedOptions"
            class="filter_select"
            label-key="label"
            value-key="value"
            :placeholder="t('BEDS')"
            :loading="loading"
            clearable
            :is-filter="true"
            :is-locale="false"
            style="width: 120px"
            :disabled="!filters.roomId"
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
                  <el-dropdown-item v-if="row.status !== 'COMPLETED'">
                    <button
                      @click="
                        handleDropClick(
                          `/patients/${route.params.patientId}/visit/${row.id}/add-days?tab=stay`,
                          t('ADD_DAYS')
                        )
                      "
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("ADD_DAYS") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasPermission('patient', 'add_new_to_visit')"
                    @click="
                      handleDropClick(
                        `/patients/${route.params.patientId}/visit/${row.id}/stay-summary?tab=stay`,
                        row.code
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
                    @click="StayCompleteAction(row.id)"
                  >
                    <span
                      class="text-xs flex gap-1 items-center font-medium text-gray-400 pb-0"
                    >
                      {{ t("COMPLETE_STAY") }}
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasPermission('patient', 'add_new_to_visit')"
                    @click="deleteStayAction(row.id)"
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
                  `/patients/${route.params.patientId}/visit/${row.id}/stay-summary?tab=stay`,
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
        <el-table-column :label="t('ROOMS')">
          <template #default="{ row }">
            {{ row.room?.number || "----" }}
          </template>
        </el-table-column>
        <el-table-column :label="t('BEDS')">
          <template #default="{ row }">
            <span v-if="row.bed?.number">
              {{ row.bed.number }}
              <span v-if="row.bed.status"> ({{ t(row.bed.status) }})</span>
            </span>
            <span v-else>----</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('DAY_COUNT')"
          :formatter="(row) => row.dayCount || '----'"
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
    <StayCompleteDialog
      v-if="isStayCompleteVisible"
      v-model="isStayCompleteVisible"
      @close="isStayCompleteVisible = false"
      :stay-id="visitId || undefined"
      @get-data="getData"
    />
    <StayDeleteDialog
      v-if="isStayDeleteVisible"
      v-model="isStayDeleteVisible"
      @close="isStayDeleteVisible = false"
      :stay-id="visitId || undefined"
      @get-data="getData"
    />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { debounce } from "lodash";
import dayjs from "dayjs";
const { t } = useI18n();
const route = useRoute();
const { $axios } = useNuxtApp();
const isStayCompleteVisible = ref(false);
const isStayDeleteVisible = ref(false);
const isMounted = ref(false);
const rooms = ref<any>([]);
const bedOptions = ref<any[]>([]);
const isLoading = ref(false);
const loading = ref(false);
const router = useRouter();
const { hasPermission } = usePermission();
const visitId = ref<number | null>(null);
const value2 = ref<[Date, Date] | undefined>(undefined);
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
  desc: true,
  page: 1,
  size: 10,
  patientId: route.params?.patientId,
  status: null,
  startDate: null as string | null,
  endDate: null as string | null,
  roomId: null,
  bedId: null,
  date: null,
});

const tableData = ref<any>([]);
const { updateQuery } = useQuerySync(filters as any);

const getData = async () => {
  isLoading.value = true;
  try {
    const { page, patientId, ...restFilters } = filters.value;

    // Prepare request body according to /api/stay/list API
    const payload: any = {
      status: restFilters.status || undefined,
      date: restFilters.date || undefined,
      startDate: restFilters.startDate
        ? new Date(restFilters.startDate).toISOString()
        : undefined,
      endDate: restFilters.endDate
        ? new Date(restFilters.endDate).toISOString()
        : undefined,
      searchKey: restFilters.searchKey || undefined,
      desc: restFilters.desc !== undefined ? restFilters.desc : true,
      page: page - 1 || 0,
      size: filters.value.size || 10,
      // Ensure we only fetch stays related to current patient
      patientId: patientId || undefined,
    };

    // Only include roomId and bedId if they are selected
    if (restFilters.roomId) {
      payload.roomId = restFilters.roomId;
    }
    if (restFilters.bedId) {
      payload.bedId = restFilters.bedId;
    }

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    const response = await (<Axios>$axios).post("/api/stay/list", payload);
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

const remoteRoomMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 1) getRooms(queryData);
}, 300);

const getRooms = async (queryData?: { searchKey?: string }) => {
  loading.value = true;
  try {
    const response = await (<Axios>$axios).post("/api/room/list", {
      ...queryData,
      size: 500,
    });
    const data = response?.data?.payload?.list || [];
    rooms.value = data;
  } catch (error: any) {
    rooms.value = [];
  } finally {
    loading.value = false;
  }
};

const onRoomChange = (roomId: number | null) => {
  if (!roomId) {
    bedOptions.value = [];
    filters.value.bedId = null;
    return;
  }

  const selectedRoom = rooms.value.find((room: any) => room.id === roomId);
  if (selectedRoom?.beds && Array.isArray(selectedRoom.beds)) {
    bedOptions.value = selectedRoom.beds.map((bed: any) => {
      const number = bed?.number || bed?.id || "";
      const status = bed?.status || "";
      const statusLabel = status ? t(status) : "";
      const label = status ? `${number} (${statusLabel})` : number;
      return {
        label,
        value: bed?.id || bed?.number || bed,
      };
    });
  } else {
    bedOptions.value = [];
  }
};
const sortChange = (field: string, desc: boolean | null) => {
  filters.value.desc = desc !== null ? desc : true;
};
const search = (value: string) => {
  filters.value.searchKey = (value || null) as any;
};

const handleDropClick = (url: string, code?: string) => {
  if (code) useSetUrl({ name: code, url: url });
  router.push({
    path: url,
    query: { ...route.query },
  });
};
const deleteStayAction = (id: number) => {
  isStayDeleteVisible.value = true;
  visitId.value = id;
};
const StayCompleteAction = (id: number) => {
  isStayCompleteVisible.value = true;
  visitId.value = id;
};
const onChangeDatePicker = (values: (string | Date)[] | null) => {
  if (!values) {
    filters.value.startDate = null;
    filters.value.endDate = null;
    value2.value = undefined;
    getData();
    return;
  }
  const [start, end] = values;
  const startDate = new Date(start as any);
  const endDate = new Date(end as any);
  filters.value.startDate = startDate.toISOString();
  filters.value.endDate = endDate.toISOString();
  value2.value = [startDate, endDate] as [Date, Date];
  getData();
};
// hooks
const addStay = () => {
  const url = `/patients/${route.params.patientId}/visit/create-stay`;
  useSetUrl({ name: t("ADD_STAY"), url: url });
  router.push(url);
};
watch(filters.value, () => {
  getData();
});
onMounted(() => {
  getData();
  getRooms();
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
