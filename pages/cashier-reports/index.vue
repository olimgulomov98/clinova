<template>
  <CashierReportsLayout>
    <div class="page-container">
      <div class="page-title">{{ t("CASHIER_REPORTS") }}</div>

      <!-- Date Range Picker and Add Button -->
      <div class="date-picker-container">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="DD MMM YYYY"
          value-format="YYYY-MM-DD"
          @change="onChangeDatePicker"
          ref="datePickerRef"
          style="
            border-radius: 8px;
            background: #f1d4d4;
            border: none;
            height: 30px;
          "
        />
        <el-button
          type="primary"
          @click="onAddClick"
          style="
            height: 30px;
            border-radius: 8px;
            background: #fd4245;
            border: none;
            position: absolute;
            right: 0;
          "
        >
          {{ t("ADD") }}
        </el-button>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </div>

      <!-- Cashier Reports Table -->
      <div v-else>
        <table class="cashier-table">
          <thead>
            <tr>
              <th class="sortable" @click="sortTable('date')">
                <div>{{ t("DATE") }}</div>

                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('cashier')">
                {{ t("CASHIER") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('cashTotal')">
                {{ t("CASH_TOTAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('terminalTotal')">
                {{ t("TERMINAL_TOTAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('multicardTotal')">
                {{ t("MULTICARD_TOTAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('cashActual')">
                {{ t("CASH_ACTUAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('terminalActual')">
                {{ t("TERMINAL_ACTUAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('multicardActual')">
                {{ t("MULTICARD_ACTUAL") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('cashExpense')">
                {{ t("CASH_EXPENSE") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('terminalExpense')">
                {{ t("TERMINAL_EXPENSE") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('multicardExpense')">
                {{ t("MULTICARD_EXPENSE") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('cashLoss')">
                {{ t("CASH_LOSS") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
              <th class="sortable" @click="sortTable('reason')">
                {{ t("REASON") }}
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in cashierReports" :key="index">
              <td>{{ report.date }}</td>
              <td>{{ report.cashier }}</td>
              <td>{{ formatAmount(report.cashTotal) }}</td>
              <td>{{ formatAmount(report.terminalTotal) }}</td>
              <td>{{ formatAmount(report.multicardTotal) }}</td>
              <td>{{ formatAmount(report.cashActual) }}</td>
              <td>{{ formatAmount(report.terminalActual) }}</td>
              <td>{{ formatAmount(report.multicardActual) }}</td>
              <td>{{ formatAmount(report.cashExpense) }}</td>
              <td>{{ formatAmount(report.terminalExpense) }}</td>
              <td>{{ formatAmount(report.multicardExpense) }}</td>
              <td>{{ formatAmount(report.cashLoss) }}</td>
              <td>{{ report.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </CashierReportsLayout>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import CashierReportsLayout from "~/components/layout/CashierReportsLayout.vue";
import { getFormatAmount } from "~/utils";
import dayjs from "dayjs";
import { ArrowDown, ArrowUp, Loading } from "@element-plus/icons-vue";

const { t } = useI18n();
const { $axios } = useNuxtApp();

// Date range picker
const dateRange = ref<[string, string] | undefined>(undefined);
const datePickerRef = ref();

// Cashier reports data
const cashierReports = ref<any[]>([]);
const loading = ref(false);

// Sorting state
const sortField = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

// Methods
const formatAmount = (amount: number) => {
  return getFormatAmount(amount);
};

const sortTable = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }

  // Sort the data
  cashierReports.value.sort((a, b) => {
    const aValue = a[field as keyof typeof a];
    const bValue = b[field as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection.value === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection.value === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
};

const onChangeDatePicker = (values: [string, string] | undefined) => {
  if (values) {
    // Fetch data for the selected date range
    fetchCashierData(values[0], values[1]);
  }
};

const router = useRouter();
const route = useRoute();
const cashierTab = useCashierTabStore();
const onAddClick = () => {
  const url = "/cashier-reports/close";
  cashierTab.setUrl({ name: "cashier-close", url });
  router.push({ path: url, query: { ...route.query } });
};

const fetchCashierData = async (startDate: string, endDate: string) => {
  try {
    loading.value = true;

    // API works without any parameters - get all data
    const response = await (<Axios>$axios).post("/api/cashier/list", {});

    if (response.data?.payload?.list) {
      // Map API response to our table format
      cashierReports.value = response.data.payload.list.map((item: any) => ({
        id: item.id,
        date: item.date,
        cashier: item?.cashier?.name || "-",
        cashTotal: item.cashTotal || 0,
        terminalTotal: item.terminalTotal || 0,
        multicardTotal: item.multicardTotal || 0,
        cashActual: item.cashActual || 0,
        terminalActual: item.terminalActual || 0,
        multicardActual: item.multicardActual || 0,
        cashExpense: item.cashExpense || 0,
        terminalExpense: item.terminalExpense || 0,
        multicardExpense: item.multicardExpense || 0,
        cashLoss: item.cashLoss || 0,
        reason: item.lossReason || "",
      }));
    } else {
      cashierReports.value = [];
    }
  } catch (error: any) {
    console.error("Failed to fetch cashier data:", error);
    console.error("Error response:", error.response?.data);
    cashierReports.value = [];
  } finally {
    loading.value = false;
  }
};

// Initialize with current month
onMounted(() => {
  const today = dayjs();
  const startOfMonth = today.startOf("month").format("YYYY-MM-DD");
  const endOfMonth = today.endOf("month").format("YYYY-MM-DD");

  dateRange.value = [startOfMonth, endOfMonth];
  fetchCashierData(startOfMonth, endOfMonth);
});
</script>

<style scoped lang="scss">
.date-picker-container {
  margin-bottom: 24px;
  position: relative;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  .is-loading {
    font-size: 24px;
    color: #409eff;
  }
}

.cashier-table {
  width: 100%;
  font-family: "SourceSans3", sans-serif;

  thead {
    background: #f1d4d4;

    th {
      padding: 8px;
      text-align: left;
      font-weight: 500;
      font-size: 14px;
      color: #3a4e63;
      position: relative;
      background: #f1d4d4 !important;

      &:first-child {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }

      &:last-child {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .sort-icons {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;

        .sort-icon {
          width: 7px;
          height: 7px;
          color: #000;
          transition: color 0.2s ease;
        }
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s ease;

      td {
        padding: 12px;
        font-weight: 500;
        font-size: 14px;
        color: #3a4e63;
        vertical-align: middle;
      }
    }
  }
}

// Responsive design
@media (max-width: 1200px) {
  .cashier-table-container {
    overflow-x: auto;
  }

  .cashier-table {
    min-width: 1200px;
  }
}

@media (max-width: 768px) {
  .date-picker-container {
    margin-bottom: 16px;
  }

  .cashier-table {
    font-size: 12px;

    thead th {
      padding: 12px 8px;
      font-size: 12px;
    }

    tbody td {
      padding: 8px;
      font-size: 12px;
    }
  }
}
</style>
