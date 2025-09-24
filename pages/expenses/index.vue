<template>
  <div class="page-container">
    <div class="page-title">{{ t("EXPENSES_LIST") }}</div>

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
          background: #eaf2f8;
          border: none;
          height: 30px;
        "
      />
      <el-button
        type="primary"
        @click="showExpenseDialog = true"
        style="
          height: 30px;
          border-radius: 8px;
          background: #1f2937;
          border: none;
          position: absolute;
          right: 0;
        "
      >
        {{ t("ADD_EXPENSE") }}
      </el-button>

      <!-- Expense Dialog -->
      <el-dialog
        v-model="showExpenseDialog"
        width="500px"
        :before-close="handleCloseDialog"
      >
        <template #title>
          <div
            style="
              text-align: center;
              width: 100%;
              margin-bottom: 12px;

              font-size: 22px;
            "
          >
            {{ t("EXPENSE") }}
          </div>
        </template>
        <el-form :model="expenseForm" label-width="120px">
          <el-form-item :label="$t('DATE')">
            <el-date-picker
              v-model="expenseForm.date"
              type="date"
              placeholder="Select date"
              format="DD MMM YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item :label="$t('TYPE')">
            <el-select
              v-model="expenseForm.type"
              :placeholder="$t('SELECT_EXPENSE_TYPE')"
              style="width: 100%"
            >
              <el-option :label="$t('CASH')" value="CASH" />
              <el-option :label="$t('TERMINAL')" value="CARD" />
              <el-option :label="$t('MULTICARD')" value="MULTICARD" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('AMOUNTS')">
            <el-input
              v-model="expenseForm.amount"
              type="number"
              :placeholder="$t('ENTER_AMOUNT')"
            />
          </el-form-item>

          <el-form-item :label="$t('DESCRIPTION')">
            <el-input
              v-model="expenseForm.description"
              type="textarea"
              :rows="3"
              :placeholder="$t('ENTER_DESCRIPTION')"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showExpenseDialog = false">{{
              t("CANCEL")
            }}</el-button>
            <el-button type="primary" @click="addExpense">{{
              t("SAVE")
            }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>

    <!-- Expense Reports Table -->
    <div v-else>
      <table class="cashier-table">
        <thead>
          <tr>
            <th class="sortable" @click="sortTable('date')">
              <div class="flex items-center gap-2">
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
                Date
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashier')">
              <div class="flex items-center gap-2">
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
                Code
              </div>
            </th>
            <th class="sortable" @click="sortTable('cashTotal')">
              <div class="flex items-center gap-2">
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
                Type
              </div>
            </th>
            <th class="sortable" @click="sortTable('terminalTotal')">
              <div class="flex items-center gap-2">
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
                Amount
              </div>
            </th>
            <th class="sortable" @click="sortTable('multicardTotal')">
              <div class="flex items-center gap-2">
                <div class="sort-icons">
                  <el-icon class="sort-icon"><ArrowUp /></el-icon>
                  <el-icon class="sort-icon"><ArrowDown /></el-icon>
                </div>
                Description
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in expenseReports" :key="index">
            <td>{{ report.date }}</td>
            <td>{{ report.code }}</td>
            <td>{{ report.type }}</td>
            <td>{{ formatAmount(report.amount) }}</td>
            <td>{{ report.description }}</td>
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
import { ArrowDown, ArrowUp, Loading } from "@element-plus/icons-vue";

const { t } = useI18n();
const { $axios } = useNuxtApp();

// Date range picker
const dateRange = ref<[string, string] | undefined>(undefined);
const datePickerRef = ref();

// Cashier reports data
const expenseReports = ref<any[]>([]);

// Loading state
const loading = ref(false);

// Dialog state
const showExpenseDialog = ref(false);

// Expense form
const expenseForm = ref({
  date: "",
  type: "",
  amount: "",
  description: "",
});

const handleCloseDialog = () => {
  showExpenseDialog.value = false;
  resetExpenseForm();
};

const resetExpenseForm = () => {
  expenseForm.value = {
    date: "",
    type: "",
    amount: "",
    description: "",
  };
};

const addExpense = async () => {
  if (
    !expenseForm.value.type ||
    !expenseForm.value.amount ||
    !expenseForm.value.date
  ) {
    console.error("Please fill in all required fields");
    return;
  }

  try {
    loading.value = true;

    const requestBody = {
      date: expenseForm.value.date, // ✅ modalda tanlangan sana
      description: expenseForm.value.description || "",
      amount: parseFloat(expenseForm.value.amount) || 0,
      type: expenseForm.value.type,
    };

    const response = await ($axios as any).post(
      "/api/expense/create",
      requestBody
    );

    showExpenseDialog.value = false;
    resetExpenseForm();

    // Refresh after creation
    fetchExpenseData();
  } catch (error: any) {
    console.error("Failed to create expense:", error);
  } finally {
    loading.value = false;
  }
};

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
  expenseReports.value.sort((a, b) => {
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
    fetchExpenseData();
  }
};

const fetchExpenseData = async () => {
  try {
    loading.value = true;

    let params: any = {};

    if (dateRange.value && dateRange.value.length === 2) {
      const start = dayjs(dateRange.value[0]).startOf("day").toISOString();
      const end = dayjs(dateRange.value[1]).endOf("day").toISOString();
      params.startDate = start;
      params.endDate = end;
    }

    const response = await (<Axios>$axios).post("/api/expense/list", params);

    if (response.data?.payload?.list) {
      expenseReports.value = response.data.payload.list.map((item: any) => ({
        id: item.id,
        date: item.date,
        code: item.code || "-",
        type: item.type || "-",
        amount: item.amount || 0,
        description: item.description || "-",
      }));
    } else {
      expenseReports.value = [];
    }
  } catch (error: any) {
    console.error("Failed to fetch expense data:", error);
    console.error("Error response:", error.response?.data);
    expenseReports.value = [];
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
  fetchExpenseData();
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
