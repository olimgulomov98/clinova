<template>
  <div v-if="hasPermission('kassa', 'full_access')">
    <PaymentLayout>
      <div class="page-container">
        <div class="box-page">
          <div class="total-page-card">
            <div class="total-card-logo">
              <icon-receipt />
            </div>
            <div class="total-summa">
              <div class="label">
                {{ t("TOTAL_INVOICES") }}
              </div>
              <div class="cost">
                {{ getFormatAmount(statistics?.total) }}
              </div>
            </div>
          </div>
          <div class="total-page-card">
            <div class="total-card-logo">
              <icon-seal-check />
            </div>
            <div class="total-summa">
              <div class="label">
                {{ t("PAID_INVOICE") }}
              </div>
              <div class="cost">
                {{ getFormatAmount(statistics?.paid) }}
              </div>
            </div>
          </div>
          <div class="total-page-card">
            <div class="total-card-logo">
              <icon-circle-dashed />
            </div>
            <div class="total-summa">
              <div class="label">
                {{ t("PENDING_INVOICE") }}
              </div>
              <div class="cost">
                {{ getFormatAmount(statistics?.pending) }}
              </div>
            </div>
          </div>
          <div class="total-page-card">
            <div class="total-card-logo">
              <icon-circle-dashed />
            </div>
            <div class="total-summa">
              <div class="label">
                {{ t("PARTIALLY_PAID") }}
              </div>
              <div class="cost">
                {{ getFormatAmount(statistics?.partialPaid) }}
              </div>
            </div>
          </div>
        </div>
        <VTable
          :filters="filters"
          :table-data="tableData?.list"
          :loading="isLoading"
          filter-right
          search-left-position
          :search-placeholder="t('SEARCH_FOR_PATIENT_NAME')"
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
              style="border-radius: 8px; border: 0; height: 30px; width: 220px"
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
            <el-table-column :label="t('CODE')">
              <template #default="{ row }">
                <div
                  @click="handleDropClick(`/payments/${row.id}`, row.code)"
                  class="link-div"
                >
                  {{ row.code }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="visit.patient.name"
              :label="t('PATIENT')"
              :formatter="(row) => row.visit?.patient?.name"
            />
            <el-table-column
              prop="creationDate"
              :label="t('DATE')"
              :formatter="(row) => getFormatDate(row.creationDate)"
            />
            <el-table-column :label="t('SERVICE')">
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
                          <li
                            v-for="(item, index) in row.items || []"
                            :key="index"
                          >
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
            </el-table-column>
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
                  <div class="status-btn">
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
    </PaymentLayout>
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
const useTab = usePaymentTabStore();
const isLoading = ref(false);
const services = ref([]);
const doctors = ref([]);
const { hasPermission } = usePermission();
const statistics = ref({
  total: 0,
  pending: 0,
  paid: 0,
  partialPaid: 0,
});
const value2 = ref([]);
const loading = ref(false);
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
  await getStatistics();
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

const getStatistics = async () => {
  isLoading.value = true;
  try {
    const { page, page_size, ...restFilters } = filters.value;
    const payload = {
      ...restFilters,
      page: 1,
      size: 100000000,
    };

    const response = await (<Axios>$axios).post(
      "/api/invoice/statistics",
      payload
    );
    const data = response?.data?.payload;
    console.log(data);
    if (data) {
      statistics.value = data;
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
  filters.value.startDate = values?.[0] || null;
  filters.value.endDate = values?.[1] || null;
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
      background: #dc2323;
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
        /* color: #3a4e63; */
      }

      .cost {
        font-family: "SourceSans3", sans-serif;
        font-weight: 600;
        line-height: 24px;
        font-size: 22px;
        /* color: #05080b; */
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
  background: #f1d4d4;

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
    background: #f1d4d4;
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
  /* color: #233955; */
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: fit-content;
}

.refresh-btn {
  border-radius: 8px;
  /* background: #f1d4d4; */
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
