<template>
  <div class="page-container mt-5">
    <VTable
      :filters="filters"
      :table-data="tableData?.list"
      :loading="isLoading"
      filter-right
      search-left-position
      :search-placeholder="t('SEARCH')"
      @sort-change="sortChange"
      @search="search"
    >
      <template #tabs>
        <el-form-item prop="statusId" class="!mb-0">
          <v-select
            class="filter_select"
            filterable
            v-model="filters.status"
            :options="statusOptions"
            label-key="name"
            value-key="id"
            :placeholder="t('STATUS')"
            clearable
            style="width: 100px"
            :is-filter="true"
          />
        </el-form-item>
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
          "
          @update:model-value="onChangeDatePicker"
          class="icon-date-picker"
          :class="{ 'date-picker-close': !!value2?.length }"
        />
        <el-button
          :icon="Refresh"
          size="small"
          class="refresh-btn"
          @click="handleRefresh"
        />
      </template>
      <template #columns>
        <el-table-column prop="action" :label="t('ACTION')">
          <template #default="{ row }">
            <el-dropdown
              :disabled="!hasPermission('patient', 'payments_action')"
            >
              <button class="p-3">
                <icon-dots />
              </button>
              <template #dropdown>
                <el-dropdown-menu class="!p-0">
                  <el-dropdown-item
                    @click="downloadPrintInvoice(row?.id, row?.code)"
                    v-if="row.status !== 'PAID'"
                  >
                    <button
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("PRINT_INVOICE") }}
                    </button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <button
                      @click="
                        handleDropClick(
                          `/patients/${route.params.patientId}/payment/${row.id}?tab=invoices`,
                          row.code
                        )
                      "
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("SUMMARY") }}
                    </button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="code" :label="t('CODE')">
          <template #default="{ row }">
            <div
              :class="{
                'link-div': hasPermission('patient', 'payments_action'),
                'text-gray-400 cursor-not-allowed': !hasPermission(
                  'patient',
                  'payments_action'
                ),
              }"
              @click="
                hasPermission('patient', 'payments_action') &&
                  handleDropClick(
                    `/patients/${route.params.patientId}/payment/${row.id}?tab=invoices`,
                    row.code
                  )
              "
            >
              {{ row.code }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="code" :label="t('VISIT_STAY')">
          <template #default="{ row }">
            <div
              :class="{
                'link-div':
                  hasPermission('patient', 'payments_action') &&
                  (row.visit || row.stay),
                'text-gray-400 cursor-not-allowed': !hasPermission(
                  'patient',
                  'payments_action'
                ),
              }"
              @click="
                hasPermission('patient', 'payments_action') &&
                  (row.visit || row.stay) &&
                  handleDropClick(
                    row.visit
                      ? `/patients/${route.params.patientId}/visit/${row.visit.id}/summary?tab=history`
                      : `/patients/${route.params.patientId}/visit/${row.stay.id}/stay-summary?tab=stay`,
                    row.visit?.code || row.stay?.code
                  )
              "
            >
              {{ row.visit?.code || row.stay?.code || "----" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="visit.patient.name"
          :label="t('PATIENT')"
          :formatter="
            (row) =>
              row.visit?.patient?.name ||
              row.stay?.patient?.name ||
              row.patient?.name ||
              '----'
          "
        />
        <el-table-column
          prop="creationDate"
          :label="t('DATE')"
          :formatter="(row) => getFormatDate(row.creationDate)"
        />
        <!-- <el-table-column :label="t('SERVICE')">
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
                        <span>{{ item.service?.name }}</span>
                      </li>
                    </ul>
                  </template>
                  <span>
                    {{ row.items?.[0]?.service?.name || "----" }}
                  </span>
                </el-tooltip>
              </li>
            </ul>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="total"
          :label="t('TOTAL')"
          :formatter="(row) => getFormatAmount(row.total)"
        />
        <el-table-column
          prop="dueAmount"
          :label="t('DUE_AMOUNT')"
          :formatter="(row) => getFormatAmount(row.dueAmount)"
        />
        <el-table-column prop="status" :label="t('STATUS')">
          <template #default="{ row }">
            <div v-if="row.status">
              <div
                class="status-btn"
                :class="{
                  'status-unpaid': row.status === 'UNPAID',
                  'status-paid': row.status === 'PAID',
                }"
              >
                {{ t(row.status) }}
              </div>
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
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatAmount, getFormatDate } from "~/utils";
import dayjs from "dayjs";
import { Refresh } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { $axios } = useNuxtApp();
const useTab = useUrlTabStore();
const isLoading = ref(false);
const { hasPermission } = usePermission();

const value2 = ref([]);
const loading = ref(false);
const showDeleteConfirm = ref(false);
const deletingId = ref<number | null>(null);
const statusOptions = [
  {
    id: "NEW",
    name: t("NEW"),
  },
  {
    id: "PAID",
    name: t("PAID"),
  },
  {
    id: "PARTIALLY_PAID",
    name: t("PENDING"),
  },
];

const filters = ref<any>({
  searchKey: null,
  departmentId: null,
  serviceId: null,
  doctorId: null,
  orderBy: null,
  patientId: Number(route.params?.patientId),
  startDate: null,
  endDate: null,
  desc: null,
  status: null,
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

    const response = await (<Axios>$axios).post("/api/invoice/list", payload);
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

const handleRefresh = () => {
  value2.value = [];
  filters.value.startDate = null;
  filters.value.endDate = null;
  filters.value.page = 1;
  getData();
};

const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};

const onChangeDatePicker = (values: string[]) => {
  filters.value.startDate = values[0];
  filters.value.endDate = values[1];
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "NEW":
      return "#2B95D6";
    case "PARTIALLY_PAID":
      return "#FFE1E1";
    case "PAID":
      return "#00C7BE";
  }
};

const handleDropClick = (url: string, code?: string) => {
  if (code) useTab.setUrl({ name: code, url: url });
  router.push({
    path: url,
    query: { ...route.query },
  });
};

const downloadPrintInvoice = async (id: string, fileName: string) => {
  try {
    const response = await (<Axios>$axios).get(`/api/pdf/invoice/${id}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the object URL
  } catch (error) {
    console.error("Failed to download invoice:", error);
  }
};

// hooks

watch(filters.value, async () => {
  await getData();
});

onMounted(async () => {
  await getData();
});
</script>

<style scoped lang="scss">
.box-page {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(25% - 20px), 1fr));
  grid-gap: 20px;
  align-items: end;
  border-bottom: 1px solid #e6e6e7;
  padding-top: 8px;
  padding-bottom: 20px;

  .total-page-card {
    display: flex;
    align-items: center;
    border-radius: 16px;
    background: #f1d4d4;
    padding: 14px 12px;
    gap: 12px;

    .total-card-logo {
      background: #ef4444;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .total-summa {
      height: 38px;

      .label {
        font-family: "SourceSans3", sans-serif;
        font-weight: 400;
        font-size: 11px;
        color: #3a4e63;
      }

      .cost {
        font-family: "SourceSans3", sans-serif;
        font-weight: 600;
        line-height: 24px;
        font-size: 22px;
        color: #05080b;
      }
    }
  }
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
  padding: 0 12px;
  font-size: 11px;
  color: #ef4444;
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: fit-content;
}

.status-unpaid {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #dc2626;
}

.status-paid {
  background-color: #d1fae5;
  color: #059669;
  border-color: #059669;
}

.refresh-btn {
  border-radius: 8px;
  background: #f1d4d4;
  border: 1px solid #ddd;
  height: 30px;
  color: #bbb;
  padding: 0 10px;

  &:hover {
    border-color: #bbb;
    color: #999;
  }
}
</style>
