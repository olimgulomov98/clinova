<template>
  <div class="page-container">
    <div class="page-title">{{ t("DAILY_REPORTS") }}</div>

    <!-- Date range picker -->
    <div class="month-selector-container">
      <el-date-picker
        v-model="dateRange"
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
          width: 260px;
        "
        @update:model-value="onChangeDateRange"
      />
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>

    <!-- Financial Report -->
    <div v-else class="financial-report">
      <!-- Revenue by services -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('revenue')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.revenue" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ t("REVENUE_BY_SERVICES") }}</span>
          </div>

          <span class="section-amount">{{
            formatAmount(servicesTotalAmount)
          }}</span>
        </div>
        <div v-if="expandedSections.revenue" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("SERVICES") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(revenue, index) in revenueData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ revenue.name }}</span>
              <span class="table-cell salary-col">{{
                formatAmount(revenue.amount)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue by rooms -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('revenue')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.revenue" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ t("REVENUE_BY_ROOMS") }}</span>
          </div>

          <span class="section-amount">{{
            formatAmount(servicesTotalAmount)
          }}</span>
        </div>
        <div v-if="expandedSections.revenue" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("SERVICES") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(revenue, index) in revenueData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ revenue.name }}</span>
              <span class="table-cell salary-col">{{
                formatAmount(revenue.amount)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctor salaries -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('salaries')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.salaries" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ t("DOCTOR_SALARIES") }}</span>
          </div>

          <span class="section-amount">{{
            formatAmount(doctorSalariesTotalAmount)
          }}</span>
        </div>
        <div v-if="expandedSections.salaries" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("EMPLOYEE") }}</span>
              <span class="table-header-cell">{{ t("COMMISSION") }}</span>
              <span class="table-header-cell">{{ t("BASIC_SALARY") }}</span>
            </div>
            <div
              v-for="(doctor, index) in doctorData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell w-[47%]">{{ doctor.name }}</span>
              <span class="table-cell w-[47%]">{{
                formatAmount(doctor.commission)
              }}</span>
              <span class="table-cell salary-col w-[8%] text-right">{{
                formatAmount(doctor.basicSalary)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Expenses -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('expenses')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.expenses" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ t("EXPENSES") }}</span>
          </div>
          <span class="section-amount">{{
            formatAmount(expensesTotalAmount)
          }}</span>
        </div>
        <div v-if="expandedSections.expenses" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("EXPENSES") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(expence, index) in expencesData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ expence.name }}</span>
              <span class="table-cell salary-col">{{
                formatAmount(expence.amount)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gross profit -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('grossProfit')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.grossProfit" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ t("GROSS_PROFIT") }}</span>
          </div>
          <span class="section-amount">{{
            formatAmount(totalPaymentAmount)
          }}</span>
        </div>
        <div v-if="expandedSections.grossProfit" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("PAYMENT_TYPE") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(service, index) in grossProfitData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ service.name }}</span>
              <span class="table-cell">{{ formatAmount(service.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctors' salaries -->
      <div class="report-section">
        <div class="section-header">
          <span class="section-title ml-[28px]">{{
            t("DOCTORS_SALARIES")
          }}</span>
          <span class="section-amount">{{
            formatAmount(employeesSalaries)
          }}</span>
        </div>
      </div>

      <!-- Expenses -->
      <div class="report-section">
        <div class="section-header">
          <span class="section-title ml-[28px]">{{ t("EXPENSES") }}</span>
          <span class="section-amount">{{ formatAmount(expensesTotal) }}</span>
        </div>
      </div>

      <!-- Revenue -->
      <div class="report-section">
        <div class="section-header">
          <span class="section-title ml-[28px]">{{ t("REVENUE") }}</span>
          <span class="section-amount">{{ formatAmount(revenue) }}</span>
        </div>
      </div>
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

// Date range picker for daily report API (startDate & endDate)
const dateRange = ref<[Date, Date] | null>([
  dayjs().startOf("day").toDate(),
  dayjs().endOf("day").toDate(),
]);

// API response data
const employees = ref<any[]>([]);
const services = ref<any[]>([]);
const expenses = ref<any[]>([]);
const cashTotal = ref(0);
const terminalTotal = ref(0);
const multicardTotal = ref(0);
const total = ref(0);
const employeesSalaries = ref(0);
const expensesTotal = ref(0);
const revenue = ref(0);

// Loading state
const loading = ref(false);

// Computed data for display
const doctorData = computed(() => {
  return employees.value.map((emp) => ({
    name: emp.name,
    commission: emp.amount,
    basicSalary: emp.basicSalary,
  }));
});

const doctorSalariesTotalAmount = computed(() => {
  return employees.value.reduce(
    (total, employee) =>
      total + (employee.commission || 0) + (employee.basicSalary || 0),
    0
  );
});

const revenueData = computed(() => {
  return services.value.map((service) => ({
    name: service.name,
    amount: service.amount,
  }));
});

const servicesTotalAmount = computed(() => {
  return services.value.reduce(
    (total, service) => total + (service.amount || 0),
    0
  );
});

const expencesData = computed(() => {
  return expenses.value.map((expense) => ({
    name: expense.name,
    amount: expense.amount,
  }));
});

const expensesTotalAmount = computed(() => {
  return expenses.value.reduce(
    (total, expense) => total + (expense.amount || 0),
    0
  );
});

const grossProfitData = computed(() => {
  return [
    {
      name: t("CASH"),
      amount: cashTotal.value,
    },
    {
      name: t("TERMINAL"),
      amount: terminalTotal.value,
    },
    {
      name: t("MULTICARD"),
      amount: multicardTotal.value,
    },
  ];
});

const totalPaymentAmount = computed(() => {
  return cashTotal.value + terminalTotal.value + multicardTotal.value;
});

// Expandable sections
const expandedSections = ref({
  revenue: false,
  salaries: false,
  expenses: false,
  grossProfit: false,
});

// Methods
const formatAmount = (amount: number) => {
  return getFormatAmount(amount);
};

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

const onChangeDateRange = (values: [Date, Date] | null) => {
  if (!values) {
    dateRange.value = null;
    // You can choose to clear data or keep last result; here we just skip fetch
    return;
  }
  dateRange.value = values;
  const [start, end] = values;
  fetchFinancialData(start, end);
};

const fetchFinancialData = async (start?: Date, end?: Date) => {
  try {
    loading.value = true;

    // Determine start and end dates (fallback to today if not provided)
    const startDate = dayjs(start || dayjs().startOf("day")).format(
      "YYYY-MM-DD"
    );
    const endDate = dayjs(end || dayjs().endOf("day")).format("YYYY-MM-DD");

    const response = await (<Axios>$axios).post(
      `/api/report/daily?startDate=${startDate}&endDate=${endDate}`,
      {}
    );

    if (response.data && response.data.payload) {
      const data = response.data.payload;

      // Update detailed data
      employees.value = data.employees || [];
      services.value = data.services || [];
      expenses.value = data.expenses || [];

      // Update payment totals
      cashTotal.value = data.cashTotal || 0;
      terminalTotal.value = data.terminalTotal || 0;
      multicardTotal.value = data.multicardTotal || 0;
      total.value = data.total || 0;
      employeesSalaries.value = data.employeesSalaries || 0;
      expensesTotal.value = data.expensesTotal || 0;
      revenue.value = data.revenue || 0;
    }
  } catch (error: any) {
    console.log("Failed to fetch financial data:", error);
    console.log("Error message:", error.message);

    // Show more detailed error information
    if (error.response?.data) {
      console.log(
        "API Error Details:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    // You might want to show a notification to the user here
  } finally {
    loading.value = false;
  }
};

// Initialize with today's date range
onMounted(async () => {
  await fetchFinancialData(
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  );
});
</script>

<style scoped lang="scss">
.month-selector-container {
  margin-bottom: 24px;
  position: relative;

  :deep(.el-select__wrapper) {
    background-color: #f1d4d4 !important;
    border: none !important;
    box-shadow: none !important;
  }

  :deep(.el-select__placeholder) {
    color: #666;
    font-family: "SourceSans3", sans-serif;
  }

  :deep(.el-select__selected-item) {
    color: #333;
    font-family: "SourceSans3", sans-serif;
  }
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  font-size: 16px;
  color: #666;
  font-family: "SourceSans3", sans-serif;

  .el-icon {
    font-size: 20px;
  }
}

.financial-report {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-section {
  border: 1px solid #e6e6e7;
  border-radius: 12px;
  padding: 16px 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    font-family: "SourceSans3", sans-serif;
  }

  .section-amount {
    font-size: 18px;
    font-weight: 600;
    font-family: "SourceSans3", sans-serif;
  }

  .arrow-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
    cursor: pointer;
  }
}

.section-content {
  margin-top: 24px;
}

.employee-table {
  border-radius: 8px;
  overflow: hidden;

  .table-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 36px;
    border-radius: 12px;
    background: #f1d4d4;
    font-weight: 500;
    font-size: 14px;
    color: #3a4e63;
    font-family: "SourceSans3", sans-serif;
  }

  .table-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 36px;
    border-bottom: 1px solid #e6e6e7;

    &:last-child {
      border-bottom: none;
    }

    .table-cell {
      font-size: 14px;
      color: #3a4e63;
      font-family: "SourceSans3", sans-serif;
    }
  }
}

.payment-breakdown {
  margin: 24px 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  .breakdown-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    padding: 12px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
    font-family: "SourceSans3", sans-serif;
  }

  .breakdown-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .breakdown-label {
      font-size: 14px;
      color: #374151;
      font-family: "SourceSans3", sans-serif;
    }

    .breakdown-amount {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      font-family: "SourceSans3", sans-serif;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .date-picker-container .custom-date-picker {
    min-width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .payment-breakdown .breakdown-header,
  .payment-breakdown .breakdown-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .summary-section .summary-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
