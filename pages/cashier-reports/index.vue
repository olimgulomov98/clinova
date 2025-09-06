<template>
  <div class="page-container">
    <div class="page-title">{{ t("CASHIER_REPORTS") }}</div>

    <!-- Date Range Picker -->
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
          background: #eaf2f8;
          border: none;
          height: 30px;
          width: 220px;
        "
      />
    </div>

    <!-- Cashier Reports Table -->
    <div>
      <table class="cashier-table">
        <thead>
          <tr>
            <th class="sortable" @click="sortTable('date')">
              <div>Date</div>

              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashier')">
              Cashier
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashTotal')">
              Cash Total
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('terminalTotal')">
              Terminal Total
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('multicardTotal')">
              Multicard Total
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashActual')">
              Cash Actual
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('terminalActual')">
              Terminal Actual
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('multicardActual')">
              Multicard Actual
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashExpense')">
              Cash Expense
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('terminalExpense')">
              Terminal Expence
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('multicardExpense')">
              Multicard Expence
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashLoss')">
              Cash loss
              <div class="sort-icons">
                <el-icon class="sort-icon"><ArrowUp /></el-icon>
                <el-icon class="sort-icon"><ArrowDown /></el-icon>
              </div>
            </th>
            <th class="sortable" @click="sortTable('reason')">
              Reason
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
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatAmount } from "~/utils";
import dayjs from "dayjs";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

const { t } = useI18n();
const { $axios } = useNuxtApp();

// Date range picker
const dateRange = ref<[string, string] | undefined>(undefined);
const datePickerRef = ref();

// Cashier reports data
const cashierReports = ref([
  {
    date: "29/08/2025",
    cashier: "Muhammad",
    cashTotal: 999999999,
    terminalTotal: 999999999,
    multicardTotal: 999999999,
    cashActual: 999999999,
    terminalActual: 999999999,
    multicardActual: 999999999,
    cashExpense: 999999999,
    terminalExpense: 999999999,
    multicardExpense: 999999999,
    cashLoss: 999999999,
    reason: "More expances",
  },
  {
    date: "29/08/2025",
    cashier: "Abdulloh",
    cashTotal: 999999999,
    terminalTotal: 999999999,
    multicardTotal: 999999999,
    cashActual: 999999999,
    terminalActual: 999999999,
    multicardActual: 999999999,
    cashExpense: 999999999,
    terminalExpense: 999999999,
    multicardExpense: 999999999,
    cashLoss: 999999999,
    reason: "More expances",
  },
  {
    date: "29/08/2025",
    cashier: "Ulug'bek",
    cashTotal: 999999999,
    terminalTotal: 999999999,
    multicardTotal: 999999999,
    cashActual: 999999999,
    terminalActual: 999999999,
    multicardActual: 999999999,
    cashExpense: 999999999,
    terminalExpense: 999999999,
    multicardExpense: 999999999,
    cashLoss: 999999999,
    reason: "More expances",
  },
  {
    date: "29/08/2025",
    cashier: "Samandar",
    cashTotal: 999999999,
    terminalTotal: 999999999,
    multicardTotal: 999999999,
    cashActual: 999999999,
    terminalActual: 999999999,
    multicardActual: 999999999,
    cashExpense: 999999999,
    terminalExpense: 999999999,
    multicardExpense: 999999999,
    cashLoss: 999999999,
    reason: "More expances",
  },
  {
    date: "29/08/2025",
    cashier: "Abdurahim",
    cashTotal: 999999999,
    terminalTotal: 999999999,
    multicardTotal: 999999999,
    cashActual: 999999999,
    terminalActual: 999999999,
    multicardActual: 999999999,
    cashExpense: 999999999,
    terminalExpense: 999999999,
    multicardExpense: 999999999,
    cashLoss: 999999999,
    reason: "More expances",
  },
]);

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

const fetchCashierData = async (startDate: string, endDate: string) => {
  try {
    // Here you would call your API to fetch cashier data
    console.log("Fetching cashier data for:", startDate, "to", endDate);

    // Example API call:
    // const response = await (<Axios>$axios).post('/api/cashier-reports', {
    //   startDate,
    //   endDate
    // });
    // cashierReports.value = response.data.reports;
  } catch (error) {
    console.error("Failed to fetch cashier data:", error);
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

.cashier-table {
  width: 100%;
  font-family: "SourceSans3", sans-serif;

  thead {
    background: #eaf2f8;

    th {
      padding: 8px;
      text-align: left;
      font-weight: 500;
      font-size: 14px;
      color: #3a4e63;
      position: relative;
      background: #eaf2f8 !important;

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
