<template>
  <div class="page-container">
    <div class="page-title">{{ t("REPORTS") }}</div>

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

    <!-- Financial Report -->
    <div class="financial-report">
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
            <span class="section-title">Revenue by services</span>
          </div>

          <span class="section-amount">{{
            formatAmount(revenueByServices)
          }}</span>
        </div>
        <div v-if="expandedSections.revenue" class="section-content">
          <!-- Revenue details can be added here -->
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
            <span class="section-title">Doctor salaries</span>
          </div>

          <span class="section-amount">{{ formatAmount(doctorSalaries) }}</span>
        </div>
        <div v-if="expandedSections.salaries" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">Employee</span>
              <span class="table-header-cell">Commission</span>
              <span class="table-header-cell">Basic salary</span>
            </div>
            <div
              v-for="(doctor, index) in doctorData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ doctor.name }}</span>
              <span class="table-cell">{{
                formatAmount(doctor.commission)
              }}</span>
              <span class="table-cell salary-col">{{
                doctor.basicSalary
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
            <span class="section-title">Expenses</span>
          </div>
          <span class="section-amount">{{ formatAmount(expenses) }}</span>
        </div>
        <div v-if="expandedSections.expenses" class="section-content">
          <!-- Expense details can be added here -->
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
            <span class="section-title">Gross profit</span>
          </div>
          <span class="section-amount">{{ formatAmount(grossProfit) }}</span>
        </div>
        <div v-if="expandedSections.grossProfit" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">Payment type</span>
              <span class="table-header-cell">Amount</span>
            </div>
            <div
              v-for="(service, index) in serviceData"
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
          <span class="section-title ml-[28px]">Doctors' salaries</span>
          <span class="section-amount">{{ formatAmount(doctorSalaries) }}</span>
        </div>
      </div>

      <!-- Expenses -->
      <div class="report-section">
        <div class="section-header">
          <span class="section-title ml-[28px]">Expenses</span>
          <span class="section-amount">{{ formatAmount(expenses) }}</span>
        </div>
      </div>

      <!-- Revenue -->
      <div class="report-section">
        <div class="section-header">
          <span class="section-title ml-[28px]">Revenue</span>
          <span class="section-amount">{{
            formatAmount(revenueByServices)
          }}</span>
        </div>
      </div>
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

// Financial data
const revenueByServices = ref(2200000);
const doctorSalaries = ref(1000000);
const expenses = ref(500000);

// Doctor data for dropdown table
const doctorData = ref([
  {
    name: "Doctor 1",
    commission: 100000,
    basicSalary: 10,
  },
  {
    name: "Doctor 2",
    commission: 200000,
    basicSalary: 15,
  },
  {
    name: "Doctor 3",
    commission: 300000,
    basicSalary: 10,
  },
  {
    name: "Doctor 4",
    commission: 400000,
    basicSalary: 20,
  },
]);

// Service data for Gross profit dropdown
const serviceData = ref([
  {
    name: "Cash",
    amount: 1000000,
  },
  {
    name: "Terminal",
    amount: 500000,
  },
  {
    name: "Multicard",
    amount: 700000,
  },
]);

// Computed values
const grossProfit = computed(() => {
  return revenueByServices.value - doctorSalaries.value - expenses.value;
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

const formatDateRange = (range: [string, string] | undefined) => {
  if (!range || !range[0] || !range[1]) {
    return "Select date range";
  }

  const startDate = dayjs(range[0]);
  const endDate = dayjs(range[1]);

  return `${startDate.format("D MMM")} - ${endDate.format("D MMM YYYY")}`;
};

const onChangeDatePicker = (values: [string, string] | undefined) => {
  if (values) {
    // Fetch data for the selected date range
    fetchFinancialData(values[0], values[1]);
  }
};

const fetchFinancialData = async (startDate: string, endDate: string) => {
  try {
    // Here you would call your API to fetch financial data
    // For now, using mock data
    console.log("Fetching data for:", startDate, "to", endDate);

    // Example API call:
    // const response = await (<Axios>$axios).post('/api/reports/financial', {
    //   startDate,
    //   endDate
    // });
    //
    // revenueByServices.value = response.data.revenueByServices;
    // doctorSalaries.value = response.data.doctorSalaries;
    // expenses.value = response.data.expenses;
    // paymentBreakdown.value = response.data.paymentBreakdown;
  } catch (error) {
    console.error("Failed to fetch financial data:", error);
  }
};

// Initialize with current month
onMounted(() => {
  const today = dayjs();
  const startOfMonth = today.startOf("month").format("YYYY-MM-DD");
  const endOfMonth = today.endOf("month").format("YYYY-MM-DD");

  dateRange.value = [startOfMonth, endOfMonth];
  fetchFinancialData(startOfMonth, endOfMonth);
});
</script>

<style scoped lang="scss">
.date-picker-container {
  margin-bottom: 24px;
  position: relative;

  .hidden-date-picker {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
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
    background: #f3f8fb;
    font-weight: 500;
    font-size: 14px;
    color: #3a4e63;
    font-family: "SourceSans3", sans-serif;
  }

  .table-row {
    display: flex;
    flex-direction: row;
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
