<template>
  <div class="page-container">
    <div class="page-title">{{ t("CASHIER_CLOSE") }}</div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("CASH") }}</span>
          <span class="card-amount">{{ formatAmount(cashTotal) }}</span>
        </div>
        <!-- <div class="card-comparison">
          <span class="comparison-text">
            {{ formatAmount(cashDifference) }} {{ t("MORE_THAN_YESTERDAY") }}
          </span>
          <span
            class="comparison-percentage"
            :class="cashPercentage >= 0 ? 'positive' : 'negative'"
          >
            {{ cashPercentage >= 0 ? "+" : "" }}{{ cashPercentage.toFixed(1) }}%
          </span>
        </div> -->
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("TERMINAL") }}</span>
          <span class="card-amount">{{ formatAmount(terminalTotal) }}</span>
        </div>
        <!-- <div class="card-comparison">
          <span class="comparison-text">
            {{ formatAmount(terminalDifference) }}
            {{ t("MORE_THAN_YESTERDAY") }}
          </span>
          <span
            class="comparison-percentage"
            :class="terminalPercentage >= 0 ? 'positive' : 'negative'"
          >
            {{ terminalPercentage >= 0 ? "+" : ""
            }}{{ terminalPercentage.toFixed(1) }}%
          </span>
        </div> -->
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("MULTICARD") }}</span>
          <span class="card-amount">{{ formatAmount(multicardTotal) }}</span>
        </div>
        <!-- <div class="card-comparison">
          <span class="comparison-text">
            {{ formatAmount(multicardDifference) }}
            {{ t("MORE_THAN_YESTERDAY") }}
          </span>
          <span
            class="comparison-percentage"
            :class="multicardPercentage >= 0 ? 'positive' : 'negative'"
          >
            {{ multicardPercentage >= 0 ? "+" : ""
            }}{{ multicardPercentage.toFixed(1) }}%
          </span>
        </div> -->
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("TOTAL") }}</span>
          <span class="card-amount">{{ formatAmount(totalAmount) }}</span>
        </div>
        <!-- <div class="card-comparison">
          <span class="comparison-text">
            {{ formatAmount(totalDifference) }} {{ t("MORE_THAN_YESTERDAY") }}
          </span>
          <span
            class="comparison-percentage"
            :class="totalPercentage >= 0 ? 'positive' : 'negative'"
          >
            {{ totalPercentage >= 0 ? "+" : ""
            }}{{ totalPercentage.toFixed(1) }}%
          </span>
        </div> -->
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">Expense Cash</span>
          <span class="card-amount">{{ formatAmount(cashTotal) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">Expense Terminal</span>
          <span class="card-amount">{{ formatAmount(terminalTotal) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">Expense Multicard</span>
          <span class="card-amount">{{ formatAmount(multicardTotal) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">Expense Total</span>
          <span class="card-amount">{{ formatAmount(totalAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">{{ t("CASH") }}</label>
            <el-input
              v-model="countedCash"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">{{ t("TERMINAL") }}</label>
            <el-input
              v-model="countedTerminal"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">{{ t("MULTICARD") }}</label>
            <el-input
              v-model="countedMulticard"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("TOTAL") }}</span>
          <span class="card-amount">{{ formatAmount(totalAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summaryy-cards">
      <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">Lost</label>
            <el-input
              v-model="countedCash"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">Lost Reason</label>
            <el-input
              v-model="countedTerminal"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div>

      <!-- <div class="summary-card">
        <div class="card-header">
          <div class="input-group">
            <label class="input-label">{{ t("MULTICARD") }}</label>
            <el-input
              v-model="countedMulticard"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="amount-input"
            />
          </div>
        </div>
      </div> -->

      <!-- <div class="summary-card">
        <div class="card-header">
          <span class="card-title">{{ t("TOTAL") }}</span>
          <span class="card-amount">{{ formatAmount(totalAmount) }}</span>
        </div>
      </div> -->
    </div>

    <!-- Counted Amounts Section -->
    <!-- <div class="counted-amounts-section">
      <h3 class="section-title">{{ t("COUNTED_AMOUNTS") }}</h3>


      <div class="input-row">
        <div class="input-group">
          <label class="input-label">{{ t("CASH") }}</label>
          <el-input
            v-model="countedCash"
            type="number"
            :placeholder="t('ENTER_AMOUNT')"
            class="amount-input"
          />
        </div>

        <div class="input-group">
          <label class="input-label">{{ t("TERMINAL") }}</label>
          <el-input
            v-model="countedTerminal"
            type="number"
            :placeholder="t('ENTER_AMOUNT')"
            class="amount-input"
          />
        </div>

        <div class="input-group">
          <label class="input-label">{{ t("MULTICARD") }}</label>
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
            <h4 class="expenses-title">{{ t("EXPENSES") }}</h4>
            <el-input
              v-model="expenseAmount"
              type="number"
              :placeholder="t('ENTER_AMOUNT')"
              class="expense-amount-input"
            />
          </div>

          <div class="expense-description-group">
            <h4 class="expenses-title">{{ t("EXPENSE_DESCRIPTION") }}</h4>
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
    </div> -->

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

      <!-- <el-button
        size="large"
        @click="onPrintPDF"
        :disabled="submitting"
        class="print-pdf-btn"
      >
        {{ t("PRINT_PDF") }}
      </el-button>

      <el-button
        size="large"
        @click="onSaveDraft"
        :loading="submitting"
        :disabled="submitting"
        class="save-draft-btn"
      >
        {{ submitting ? "Saving Draft..." : t("SAVE_DRAFT") }}
      </el-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFormatAmount } from "~/utils";

const { t } = useI18n();

// Summary data
const cashTotal = ref(1000000);
const terminalTotal = ref(500000);
const multicardTotal = ref(700000);
const totalAmount = computed(
  () => cashTotal.value + terminalTotal.value + multicardTotal.value
);

// Yesterday's data for comparison
const yesterdayCash = ref(600000);
const yesterdayTerminal = ref(426000);
const yesterdayMulticard = ref(660000);
const yesterdayTotal = computed(
  () => yesterdayCash.value + yesterdayTerminal.value + yesterdayMulticard.value
);

// Differences and percentages
const cashDifference = computed(() => cashTotal.value - yesterdayCash.value);
const terminalDifference = computed(
  () => terminalTotal.value - yesterdayTerminal.value
);
const multicardDifference = computed(
  () => multicardTotal.value - yesterdayMulticard.value
);
const totalDifference = computed(
  () => totalAmount.value - yesterdayTotal.value
);

const cashPercentage = computed(
  () => (cashDifference.value / yesterdayCash.value) * 100
);
const terminalPercentage = computed(
  () => (terminalDifference.value / yesterdayTerminal.value) * 100
);
const multicardPercentage = computed(
  () => (multicardDifference.value / yesterdayMulticard.value) * 100
);
const totalPercentage = computed(
  () => (totalDifference.value / yesterdayTotal.value) * 100
);

// Counted amounts
const countedCash = ref("");
const countedTerminal = ref("");
const countedMulticard = ref("");

// Expenses
const expenseAmount = ref("");
const expenseDescription = ref("");

// Loading state
const loading = ref(false);
const submitting = ref(false);

// Methods
const formatAmount = (amount: number) => {
  return getFormatAmount(amount);
};

const onCloseShift = () => {
  // Navigate back to cashier reports
  navigateTo("/cashier-reports");
};

const onPrintPDF = () => {
  console.log("Print PDF clicked");
  // Implement print PDF logic
};

const onSaveDraft = async () => {
  try {
    submitting.value = true;

    // Validate required fields
    if (
      !countedCash.value ||
      !countedTerminal.value ||
      !countedMulticard.value
    ) {
      ElMessage.error("Please fill all required fields");
      return;
    }

    // Prepare API data
    const requestData = {
      cashTotal: parseFloat(countedCash.value) || 0,
      terminalTotal: parseFloat(countedTerminal.value) || 0,
      multicardTotal: parseFloat(countedMulticard.value) || 0,
      cashActual: parseFloat(countedCash.value) || 0,
      terminalActual: parseFloat(countedTerminal.value) || 0,
      multicardActual: parseFloat(countedMulticard.value) || 0,
      cashExpense: parseFloat(expenseAmount.value) || 0,
      terminalExpense: 0,
      multicardExpense: 0,
      cashLoss: 0,
      lossReason: expenseDescription.value || "",
    };

    console.log("Submitting cashier close data:", requestData);

    // Call API
    const { $axios } = useNuxtApp();
    const response = await $axios.post("/api/cashier/close", requestData);

    console.log("Cashier close response:", response.data);

    ElMessage.success("Shift closed successfully");

    // Reset form
    resetForm();
  } catch (error: any) {
    console.error("Failed to close shift:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    ElMessage.error("Failed to close shift");
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  countedCash.value = "";
  countedTerminal.value = "";
  countedMulticard.value = "";
  expenseAmount.value = "";
  expenseDescription.value = "";
};

const loadDraft = () => {
  try {
    const draftData = localStorage.getItem("cashierCloseDraft");
    if (draftData) {
      const parsed = JSON.parse(draftData);
      countedCash.value = parsed.countedCash || "";
      countedTerminal.value = parsed.countedTerminal || "";
      countedMulticard.value = parsed.countedMulticard || "";
      expenseAmount.value = parsed.expenseAmount || "";
      expenseDescription.value = parsed.expenseDescription || "";
    }
  } catch (error) {
    console.error("Failed to load draft:", error);
  }
};

// Load draft on mount
onMounted(() => {
  loadDraft();
});
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #3a4e63;
  margin-bottom: 24px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.summaryy-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
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

  .card-comparison {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .comparison-text {
      font-size: 12px;
      color: #6b7280;
    }

    .comparison-percentage {
      font-size: 12px;
      font-weight: 600;

      &.positive {
        color: #10b981;
      }

      &.negative {
        color: #ef4444;
      }
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

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #3a4e63;
    margin-bottom: 20px;
  }

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
          font-size: 16px;
          font-weight: 600;
          color: #3a4e63;
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
          font-size: 16px;
          font-weight: 600;
          color: #3a4e63;
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
            padding: 12px 16px;
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
    border-color: #1f2937;
    color: white;
    font-weight: 600;
  }

  .print-pdf-btn {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
    font-weight: 500;
  }

  .save-draft-btn {
    background: white;
    border-color: #d1d5db;
    color: #374151;
    font-weight: 500;
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
