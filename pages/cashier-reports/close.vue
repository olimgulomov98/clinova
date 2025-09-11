<template>
  <div class="page-container">
    <div class="page-title">{{ t("CASHIER_CLOSE") }}</div>

    <!-- Date Picker and Add Button -->
    <div class="date-picker-container">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="Select date"
        format="DD MMM YYYY"
        value-format="YYYY-MM-DD"
        @change="onChangeDatePicker"
        ref="datePickerRef"
        :clearable="false"
        :editable="false"
        :teleported="true"
        :disabled="false"
        :readonly="false"
        :append-to-body="true"
        popper-class="custom-date-picker-popper"
        :picker-options="pickerOptions"
        class="custom-date-picker"
      />
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <template v-else>
        <div class="summary-card">
          <div class="card-header">
            <span class="card-title">{{ t("CASH") }}</span>
            <span class="card-amount">{{ formatAmount(cashTotal) }}</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <span class="card-title">{{ t("TERMINAL") }}</span>
            <span class="card-amount">{{ formatAmount(terminalTotal) }}</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <span class="card-title">{{ t("MULTICARD") }}</span>
            <span class="card-amount">{{ formatAmount(multicardTotal) }}</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <span class="card-title">{{ t("TOTAL") }}</span>
            <span class="card-amount">{{ formatAmount(totalAmount) }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Summary Expense Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("EXPENSE_CASH") }}</span>
          <span class="card-amount">{{ formatAmount(cashExpense) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("EXPENSE_TERMINAL") }}</span>
          <span class="card-amount">{{ formatAmount(terminalExpense) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("EXPENSE_MULTICARD") }}</span>
          <span class="card-amount">{{ formatAmount(multicardExpense) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("EXPENSE_TOTAL") }}</span>
          <span class="card-amount">{{ formatAmount(totalExpense) }}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end">
      <el-button
        type="primary"
        style="
          width: fit-content;
          border-radius: 8px;
          background: #1f2937;
          border: none;
        "
        @click="showExpenseDialog = true"
      >
        {{ t("ADD_EXPENSE") }}
      </el-button>
    </div>

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
        <el-form-item :label="$t('TYPE')">
          <el-select
            v-model="expenseForm.type"
            :placeholder="$t('SELECT_EXPENSE_TYPE')"
            style="width: 100%"
          >
            <el-option :label="$t('CASH')" value="CASH" />
            <el-option :label="$t('TERMINAL')" value="TERMINAL" />
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

    <!-- Counted Amounts Section -->
    <div class="counted-amounts-section">
      <div class="input-row">
        <div class="input-group">
          <label class="input-label">{{ t("ACTUAL_CASH") }}</label>
          <el-input
            v-model="countedCash"
            type="number"
            :placeholder="t('ENTER_AMOUNT')"
            class="amount-input"
          />
        </div>

        <div class="input-group">
          <label class="input-label">{{ t("ACTUAL_TERMINAL") }}</label>
          <el-input
            v-model="countedTerminal"
            type="number"
            :placeholder="t('ENTER_AMOUNT')"
            class="amount-input"
          />
        </div>

        <div class="input-group">
          <label class="input-label">{{ t("ACTUAL_MULTICARD") }}</label>
          <el-input
            v-model="countedMulticard"
            type="number"
            :placeholder="t('ENTER_AMOUNT')"
            class="amount-input"
          />
        </div>
      </div>

      <div class="expenses-section">
        <div class="expenses-row">
          <div class="expense-amount-group">
            <h4 class="expenses-title">{{ t("LOST") }}</h4>
            <el-input
              v-model="expenseAmount"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="expense-amount-input"
            />
          </div>

          <div class="expense-description-group">
            <h4 class="expenses-title">{{ t("LOST_REASON") }}</h4>
            <el-input
              v-model="expenseDescription"
              type="textarea"
              :placeholder="t('ENTER_DESCRIPTION')"
              class="expense-description-input"
              :rows="3"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <el-button
        type="primary"
        size="large"
        @click="onCloseShift"
        class="close-shift-btn"
      >
        {{ t("CLOSE_SHIFT") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFormatAmount } from "~/utils";
import dayjs from "dayjs";
import { Loading } from "@element-plus/icons-vue";

const { t } = useI18n();

// Date picker
const selectedDate = ref<string | undefined>(undefined);
const datePickerRef = ref();

// Picker options
const pickerOptions = {
  disabledDate: (time: Date) => {
    // Disable future dates
    return time.getTime() > Date.now();
  },
};

// Summary data from API
const cashTotal = ref(0);
const terminalTotal = ref(0);
const multicardTotal = ref(0);
const totalAmount = computed(
  () => cashTotal.value + terminalTotal.value + multicardTotal.value
);
const cashExpense = ref(0);
const terminalExpense = ref(0);
const multicardExpense = ref(0);
const totalExpense = computed(
  () => cashExpense.value + terminalExpense.value + multicardExpense.value
);

// Loading state
const loading = ref(false);

// Dialog state
const showExpenseDialog = ref(false);

// Expense form
const expenseForm = ref({
  type: "",
  amount: "",
  description: "",
});

// Counted amounts for the form
const countedCash = ref("");
const countedTerminal = ref("");
const countedMulticard = ref("");

// Expenses for the form
const expenseAmount = ref("");
const expenseDescription = ref("");

// Methods
const formatAmount = (amount: number) => {
  return getFormatAmount(amount);
};

const onCloseShift = async () => {
  try {
    loading.value = true;

    // Validate required fields
    if (!selectedDate.value) {
      console.error("Please select a date");
      return;
    }

    // Prepare request body
    const requestBody = {
      date: selectedDate.value,
      cashActual: parseFloat(countedCash.value) || 0,
      terminalActual: parseFloat(countedTerminal.value) || 0,
      multicardActual: parseFloat(countedMulticard.value) || 0,
      cashLoss: parseFloat(expenseAmount.value) || 0,
      lossReason: expenseDescription.value || "",
      cashTotal: cashTotal.value,
      terminalTotal: terminalTotal.value,
      multicardTotal: multicardTotal.value,
      cashExpense: cashExpense.value,
      terminalExpense: terminalExpense.value,
      multicardExpense: multicardExpense.value,
    };

    const { $axios } = useNuxtApp();
    const response = await ($axios as any).post(
      "/api/cashier/close",
      requestBody
    );

    // Navigate back to cashier reports on success
    navigateTo("/cashier-reports");
  } catch (error: any) {
    console.error("Failed to close shift:", error);
    console.error("Failed to close shift. Please try again.");
  } finally {
    loading.value = false;
  }
};

const handleCloseDialog = () => {
  showExpenseDialog.value = false;
  resetExpenseForm();
};

const onChangeDatePicker = (value: string | undefined) => {
  if (value) {
    // Extract month from selected date and fetch data
    const month = dayjs(value).format("YY-MM-DD");
    fetchCashierEvaluateData(month);
  }
};

const fetchCashierEvaluateData = async (month: string) => {
  try {
    loading.value = true;

    // Convert YY-MM-DD to YYYY-MM-DD format for API
    const dateFormatted = dayjs(month, "YY-MM-DD").format("YYYY-MM-DD");
    console.log("Formatted date for API:", dateFormatted);

    const { $axios } = useNuxtApp();
    const response = await ($axios as any).get("/api/cashier/evaluate", {
      params: {
        date: dateFormatted,
      },
    });

    if (response.data && response.data.payload) {
      const data = response.data.payload;

      // Update summary data
      cashTotal.value = data.cashTotal || 0;
      terminalTotal.value = data.terminalTotal || 0;
      multicardTotal.value = data.multicardTotal || 0;
      cashExpense.value = data.cashExpense || 0;
      terminalExpense.value = data.terminalExpense || 0;
      multicardExpense.value = data.multicardExpense || 0;
    }
  } catch (error: any) {
    console.error("Failed to fetch cashier evaluate data:", error);
    console.error("Failed to fetch data");
  } finally {
    loading.value = false;
  }
};

const resetExpenseForm = () => {
  expenseForm.value = {
    type: "",
    amount: "",
    description: "",
  };
};

const addExpense = async () => {
  if (!expenseForm.value.type || !expenseForm.value.amount) {
    console.error("Please fill in all required fields");
    return;
  }

  if (!selectedDate.value) {
    console.error("Please select a date");
    return;
  }

  try {
    loading.value = true;

    const requestBody = {
      date: selectedDate.value,
      description: expenseForm.value.description || "",
      amount: parseFloat(expenseForm.value.amount) || 0,
      type: expenseForm.value.type,
    };

    const { $axios } = useNuxtApp();
    const response = await ($axios as any).post(
      "/api/expense/create",
      requestBody
    );

    showExpenseDialog.value = false;
    resetExpenseForm();

    // Refresh the data after successful expense creation
    if (selectedDate.value) {
      const month = dayjs(selectedDate.value).format("YY-MM-DD");
      fetchCashierEvaluateData(month);
    }
  } catch (error: any) {
    console.error("Failed to create expense:", error);
    console.error("Failed to create expense. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Initialize with current date
onMounted(() => {
  const today = dayjs();
  const currentDate = today.format("YYYY-MM-DD");

  selectedDate.value = currentDate;

  // Fetch data for current month
  const month = today.format("YY-MM-DD");
  fetchCashierEvaluateData(month);
});
</script>

<style scoped lang="scss">
.page-container {
  padding: 0 14px;
  max-width: 1300px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
}

.date-picker-container {
  margin-bottom: 14px;
  position: relative;
}

.custom-date-picker {
  width: 220px !important;
}

.custom-date-picker :deep(.el-input__wrapper) {
  background: #eaf2f8 !important;
  border: none !important;
  border-radius: 8px !important;
  height: 40px !important;
  box-shadow: none !important;
}

/* Global styles for date picker */
:global(.custom-date-picker .el-input__wrapper) {
  background: #eaf2f8 !important;
  border: none !important;
  border-radius: 8px !important;
  height: 40px !important;
  box-shadow: none !important;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 14px;
}

.loading-container {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
    }

    .card-amount {
      font-size: 20px;
      font-weight: 600;
      color: #3a4e63;
    }
  }
}

.counted-amounts-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;

  .input-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .input-group {
      flex: 1;

      .input-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }

      .amount-input {
        width: 100%;

        :deep(.el-input__wrapper) {
          height: 60px;
          border-radius: 12px;
          background-color: #f8f9fa;
          border: 1px solid #e5e7eb;
          box-shadow: none;
          padding: 0 16px;
          font-size: 16px;

          &:hover {
            border-color: #d1d5db;
          }

          &.is-focus {
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
          }
        }

        :deep(.el-input__inner) {
          height: 100%;
          border: none;
          background: transparent;
          font-size: 16px;
          color: #374151;

          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }
  }

  .expenses-section {
    .expenses-row {
      display: flex;
      gap: 20px;

      .expense-amount-group {
        flex: 1;

        .expenses-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .expense-amount-input {
          width: 100%;

          :deep(.el-input__wrapper) {
            height: 60px;
            border-radius: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e5e7eb;
            box-shadow: none;
            padding: 0 16px;
            font-size: 16px;

            &:hover {
              border-color: #d1d5db;
            }

            &.is-focus {
              border-color: #409eff;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
            }
          }

          :deep(.el-input__inner) {
            height: 100%;
            border: none;
            background: transparent;
            font-size: 16px;
            color: #374151;

            &::placeholder {
              color: #9ca3af;
            }
          }
        }
      }

      .expense-description-group {
        flex: 2;

        .expenses-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .expense-description-input {
          width: 100%;

          :deep(.el-textarea__inner) {
            height: 60px;
            border-radius: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e5e7eb;
            box-shadow: none;
            padding: 16px;
            font-size: 16px;
            color: #374151;
            resize: none;

            &:hover {
              border-color: #d1d5db;
            }

            &:focus {
              border-color: #409eff;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
            }

            &::placeholder {
              color: #9ca3af;
            }
          }
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  .close-shift-btn {
    background: #1f2937;
    color: white;
    font-weight: 600;
    border-radius: 8px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .counted-amounts-section {
    .input-row {
      flex-direction: column;
      gap: 16px;
    }

    .expenses-section {
      .expenses-row {
        flex-direction: column;
        gap: 16px;
      }
    }
  }

  .action-buttons {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
