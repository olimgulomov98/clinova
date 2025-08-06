<template>
  <div class="pb-10">
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      class="flex flex-col justify-between h-full"
      :rules="rules"
      v-auto-animate
    >
      <div class="visit-create-page-container">
        <div class="grid grid-cols-3 gap-6">
          <el-form-item class="!mb-0" :label="t('PATIENT')" prop="name">
            <v-input
              :model-value="invoice?.visit?.patient?.name"
              :readonly="true"
            />
          </el-form-item>
          <el-form-item
            class="!mb-0"
            :label="t('CURRENT_DATE')"
            prop="startDate"
          >
            <v-input
              :model-value="
                dayjs(visit?.startDate + '+05:00').format('DD.MM.YYYY')
              "
              :readonly="true"
            />
          </el-form-item>
          <el-form-item :label="t('VISIT_NUMBER')" prop="patientName">
            <v-input :model-value="invoice?.visit?.code" :readonly="true" />
          </el-form-item>
        </div>
      </div>
      <SummaryServiceTable class="mt-3" :visits="invoice" />
      <div class="mt-6 flex justify-between pt-5 border-t items-start">
        <div class="flex gap-6 p-5 shadow-lg items-end">
          <el-form-item :label="t('AMOUNT')" prop="amount" class="!mb-0">
            <v-input v-model.number="form.amount" type="number" />
          </el-form-item>
          <el-form-item :label="t('PAYMENT_TYPE')" prop="type" class="!mb-0">
            <v-select
              v-model="form.type"
              :options="paymentTypes"
              filterable
              label-key="code"
              value-key="code"
            ></v-select>
          </el-form-item>
          <button
            type="button"
            @click="submitForm(formRef)"
            class="mb-1"
            :class="{
              'pointer-events-none opacity-50': loading || !invoice?.dueAmount,
            }"
          >
            <v-button type="primary" size="large" :loading="loading">{{
              t("ADD_PAYMENT")
            }}</v-button>
          </button>
        </div>
        <div class="max-w-[250px] w-full">
          <div class="flex justify-between p-[9px]">
            <div class="text-sm font-regular fs-[12px]">
              {{ t("AMOUNT_WITHOUT_DISCOUNT") }}
            </div>
            <div class="text-sm font-regular fs-[12px]">
              {{ getFormatAmount(invoice?.subTotal || 0) }} so'm
            </div>
          </div>
          <div class="flex justify-between p-[9px]">
            <div class="text-sm font-regular fs-[12px]">
              {{ t("DISCOUNT") }}
            </div>
            <div class="text-sm font-regular fs-[12px]">
              {{ getFormatAmount(Number(invoice?.discount) || 0) }} so'm
            </div>
          </div>
          <div
            class="flex justify-between p-[9px] border-b-[1px] border-dashed border-black"
          >
            <div class="text-sm font-semibold fs-[12px]">{{ t("TOTAL_") }}</div>
            <div class="text-sm font-semibold fs-[12px]">
              {{ getFormatAmount(invoice?.total || 0) }} so'm
            </div>
          </div>
          <div
            class="flex justify-between p-[9px] fs-[12px]"
            v-for="payment in payments.filter((item: any) => item.amount)"
          >
            <div>
              <p class="text-base text-[#4B83C3] font-regular fs-[12px]">
                {{ $t(payment.type) }}
              </p>
              <span class="text-xs fs-[12px]">{{
                dayjs(payment.date).format("MMM, DD YYYY")
              }}</span>
            </div>
            <div class="text-sm fs-[12px] font-regular">
              {{ getFormatAmount(payment.amount) }} so'm
            </div>
          </div>
          <div class="border-b-[1px] border-dashed border-black pb-[1px]">
            <div
              class="flex justify-between p-[9px] border-y-[1px] border-dashed border-black"
            >
              <div class="text-sm fs-[12px] font-semibold">
                {{ t("DUE_AMOUNT_") }}
              </div>
              <div class="text-sm fs-[12px] font-semibold">
                {{ getFormatAmount(invoice?.dueAmount) }} so'm
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-5">
            <el-button class="small_btn" @click="downloadPrintInvoice">{{
              t("PRINT_CHECK")
            }}</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { dayjs, type FormInstance } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import SummaryServiceTable from "~/components/views/visit/SummaryServiceTable.vue";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const tableIndex = ref(0);
const loading = ref(false);
const route = useRoute();
const paymentId = computed(() => route.params?.paymentId);
const patientId = ref<any>(null);
const doctors = ref<any>([]);
const allServices = ref<any>([]);
const services = ref<any>([]);
const patients = ref<any>([]);
const payments = ref<any>([]);
const invoice = ref<any>({});
const rules: any = {
  type: [{ required: true, message: "", trigger: "blur" }],
  amount: [{ required: true, message: "", trigger: "blur" }],
};
const paymentTypes = useConstants().PAYMENT_TYPES.map((elem) => {
  return {
    code: elem,
  };
});

const totalPrice = computed(() => {
  let total = 0;
  visit.items.forEach((elem: any) => {
    const findService: any = allServices.value.find(
      (service: any) => service.id === elem.serviceId
    );
    if (findService)
      total +=
        findService.price * elem.quantity -
        findService.price * elem.quantity * (elem.discount / 100);
  });
  return total || 0;
});
const totalPriceWithoutDiscount = computed(() => {
  let total = 0;
  visit.items.forEach((elem: any) => {
    const findService: any = allServices.value.find(
      (service: any) => service.id === elem.serviceId
    );
    if (findService) total += findService.price * elem.quantity;
  });
  return total || 0;
});
const discountPrice = computed(
  () => totalPriceWithoutDiscount.value - totalPrice.value
);
const summPayment = computed(() =>
  payments.value.reduce((a: number, b: any) => a + b.amount, 0)
);

const form = reactive({
  type: "",
  invoiceId: paymentId.value,
  amount: "",
});
const visit = reactive({
  startDate: "",
  patientId: patientId.value,
  items: [
    {
      serviceId: "",
      quantity: "",
      discount: "",
      doctorId: "",
    },
  ],
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    paymentCreate();
  });
};

async function paymentCreate() {
  loading.value = true;
  const url = "/api/invoice/payment/create";
  const method = "post";
  (<Axios>$axios)
    [method](url, { ...form })
    .then((res) => {
      notificationShower("success", t("PAYMENT_SUCCESS"));
      getInvoiceById();
      form.amount = "";
      form.type = "";
    })
    .finally(() => {
      loading.value = false;
    });
}

const getInvoiceById = async () => {
  (<Axios>$axios).get(`/api/invoice/summary/${paymentId.value}`).then((res) => {
    visit.startDate = res.data.payload.visit.startDate;
    invoice.value = res.data.payload;
    payments.value = [...res.data.payload.payments];
    form.amount = invoice.value?.dueAmount;
    if (invoice.value.total !== invoice.value.subTotal) {
      payments.value.push({ amount: 0, type: "" });
    }
    visit.items = res.data.payload.visit.items.map((elem: any) => {
      const findDoc = doctors.value.find(
        (doc: any) => doc.id === elem.doctor.id
      );
      if (!findDoc && elem.doctor)
        doctors.value.push({
          ...elem.doctor,
          name: elem.doctor.name || "----",
        });
      const findService = services.value.find(
        (service: any) => service.id === elem.service.id
      );
      if (!findService && elem.service) services.value.push(elem.service);
      return {
        serviceId: elem.service?.id,
        quantity: elem.quantity,
        discount: elem.discount,
        doctorId: elem.doctor?.id,
        department: elem.service?.department?.name,
      };
    });
    patients.value = [res.data.payload.visit.patient];
    patientId.value = res.data.payload.visit.patient?.id;
  });
};

onMounted(() => {
  if (paymentId.value) getInvoiceById();
  tableIndex.value++;
});

const downloadPrintInvoice = async () => {
  try {
    const response = await (<Axios>$axios).get(
      `/api/pdf/invoice/${invoice.value?.id}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = invoice.value?.code
      ? `invoice-${invoice.value.code}.pdf`
      : "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download invoice:", error);
  }
};
</script>

<style scoped>
:deep(.el-table tr:hover) {
  background: white !important;
}
:deep(
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
  ) {
  background: white !important;
}
.visit-create-page-container {
  display: grid;
  grid-gap: 24px;
  flex-flow: column;

  .custom-cols {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    grid-gap: 20px;
    align-items: end;
  }

  .totals {
    width: 400px;

    .section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
      padding: 9px 16px;

      .key {
        font-family: "SourceSans3", sans-serif;
        font-size: 14px;
        font-weight: 400;
      }
    }

    .section:last-child {
      border-bottom: none;
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  background-color: white;
  border-color: #a7aaad !important;
}

:deep(.v-date-picker .el-input__wrapper) {
  background-color: white !important;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  color: #757575;
}
</style>
