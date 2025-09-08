<template>
  <div class="page-container">
    <div class="page-title">{{ t("DOCTOR_SALARY") }}</div>

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
      <!-- Loading indicator -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </div>

      <!-- Doctor salaries summary -->
      <div class="report-section">
        <div class="section-header" @click="toggleSection('salary1')">
          <div class="flex items-center gap-[10px]">
            <el-icon v-if="!expandedSections.salary1" class="arrow-icon">
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{
              doctorData[0]?.name || t("DOCTOR_SALARIES")
            }}</span>
          </div>

          <span class="section-amount">{{
            formatAmount(doctorData[0]?.amount || 0)
          }}</span>
        </div>
        <div v-if="expandedSections.salary1" class="section-content">
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("SERVICES") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(doctor, index) in doctorData"
              :key="index"
              class="table-row"
            >
              <span class="table-cell">{{ doctor.name }}</span>
              <span class="table-cell salary-col">{{
                formatAmount(doctor.amount || 0)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Doctor Services Details -->
      <div
        v-for="(doctor, doctorIndex) in doctorData"
        :key="doctor.id || doctorIndex"
        class="report-section"
      >
        <div
          class="section-header"
          @click="toggleSection(`doctor-${doctorIndex}`)"
        >
          <div class="flex items-center gap-[10px]">
            <el-icon
              v-if="!expandedSections[`doctor-${doctorIndex}`]"
              class="arrow-icon"
            >
              <ArrowDown />
            </el-icon>
            <el-icon v-else class="arrow-icon">
              <ArrowUp />
            </el-icon>
            <span class="section-title">{{ doctor.name }}</span>
          </div>

          <span class="section-amount">{{
            formatAmount(doctor.amount || 0)
          }}</span>
        </div>
        <div
          v-if="expandedSections[`doctor-${doctorIndex}`]"
          class="section-content"
        >
          <div class="employee-table">
            <div class="table-header">
              <span class="table-header-cell">{{ t("SERVICES") }}</span>
              <span class="table-header-cell">{{ t("AMOUNTS") }}</span>
            </div>
            <div
              v-for="(service, serviceIndex) in doctor.services || []"
              :key="serviceIndex"
              class="table-row"
            >
              <span class="table-cell">{{ service.name }}</span>
              <span class="table-cell salary-col">{{
                formatAmount(service.amount || 0)
              }}</span>
            </div>
            <div
              v-if="!doctor.services || doctor.services.length === 0"
              class="table-row"
            >
              <span class="table-cell">{{ t("NO_SERVICES") }}</span>
              <span class="table-cell salary-col">-</span>
            </div>
          </div>
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

// Date range picker
const dateRange = ref<[string, string] | undefined>(undefined);
const datePickerRef = ref();

// Financial data
const doctorSalaries = ref(0);
const loading = ref(false);

// Doctor data from API
const doctorData = ref<any[]>([]);
const totalCommission = ref(0);

// Expandable sections
const expandedSections = ref<Record<string, boolean>>({
  salary1: false,
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
    loading.value = true;
    console.log("Fetching commission data for:", startDate, "to", endDate);

    const response = await (<Axios>$axios).post(
      `/api/report/commission?startDate=${startDate}&endDate=${endDate}`
    );

    if (response.data && response.data.payload) {
      doctorData.value = response.data.payload;

      // Calculate total commission
      // totalCommission.value = doctorData.value.reduce((total, doctor) => {
      //   return total + (doctor.amount || 0);
      // }, 0);

      // doctorSalaries.value = totalCommission.value;

      console.log("Commission data loaded successfully:", response.data);
    }
  } catch (error: any) {
    console.error("Failed to fetch commission data:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
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

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #666;
  font-size: 14px;
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
