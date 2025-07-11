<template>
  <div>
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
            <v-input :model-value="patients[0]?.name" disabled>

            </v-input>
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('CURRENT_DATE')" prop="startDate">
            <v-date-picker v-model="form.startDate" :disabled="!!visitId" format="DD.MM.YYYY" />
          </el-form-item>
          <!-- <el-form-item class="!mb-0" label="Discount" prop="name">
            <v-input v-model.number="form.discount" type="number" />
          </el-form-item> -->
          <!-- <el-form-item class="!mb-0" :label="t('PAYMENT_TYPE')" prop="paymentType">
            <v-select
              :disabled="!!visitId"
              v-model="form.paymentType"
              :options="paymentTypes"
              filterable
              label-key="code"
              value-key="code"
            ></v-select>
          </el-form-item> -->
        </div>
        <el-form-item class="!mb-0" prop="items">
          <el-table :data="form.items" :key="tableIndex" style="width: 99%">
            <el-table-column :label="t('DEPARTMENT')">
              <el-form-item>
                <v-select
                  filterable
                  v-model="departmentId"
                  :options="departments"
                  label-key="name"
                  value-key="id"
                  :placeholder="t('DEPARTMENT')"
                  class="form_select"
                  @change="changeDepartment"
                  :remote-method="remoteDepartmentMethod"
                  :loading="selectLoading"
                  :disabled="!!visitId"
                  :suffix-icon="Search"
                  remote-show-suffix
                />
              </el-form-item>
            </el-table-column>
            <el-table-column :label="t('SERVICE')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0 ? `items.${scope.$index}.serviceId` : ''
                  "
                >
                  <v-select
                    v-model="scope.row.serviceId"
                    :options="services"
                    filterable
                    label-key="name"
                    value-key="id"
                    remote
                    :remote-method="remoteServiceMethod"
                    :loading="selectLoading"
                    :disabled="!!visitId"
                    :suffix-icon="Search"
                    remote-show-suffix
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('DOCTOR')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0 ? `items.${scope.$index}.doctorId` : ''
                  "
                >
                  <v-select
                    v-model="scope.row.doctorId"
                    :options="doctors"
                    filterable
                    label-key="name"
                    value-key="id"
                    remote
                    :remote-method="remoteDoctorMethod"
                    :loading="selectLoading"
                    :disabled="!!visitId"
                    :suffix-icon="Search"
                    remote-show-suffix
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('QUANTITY')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0 ? `items.${scope.$index}.quantity` : ''
                  "
                >
                  <v-input v-model.number="scope.row.quantity" :disabled="!!visitId" type="number" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('DISCOUNT')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0 ? `items.${scope.$index}.discount` : ''
                  "
                >
                  <v-input v-model.number="scope.row.discount" :disabled="!!visitId" type="number" />
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column align="right" width="60" v-if="!visitId">
              <template #default="scope">
                <div
                  v-if="form.items.length === scope.$index + 1"
                  class="flex items-center justify-center w-full gap-x-5 cursor-pointer float-right"
                  @click="deleteItem(scope.$index)"
                >
                  <icon-trash />
                </div>
              </template>
            </el-table-column> -->
            <el-table-column align="right" width="60" v-if="!visitId">
              <template #default="scope">
                <div
                  v-if="form.items.length !== scope.$index + 1"
                  class="flex items-center justify-center w-full gap-x-5 cursor-pointer float-right"
                  @click="deleteItem(scope.$index)"
                >
                  <icon-trash />
                </div>
                <div
                  v-else
                  class="flex items-center justify-center w-full gap-x-5 cursor-pointer float-right"
                  @click="createFormItem"
                >
                  <icon-plus />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="flex justify-end">
          <div class="max-w-fit w-full">
            <div class="flex justify-between p-[9px] gap-4">
              <div class="text-sm font-regular text-nowrap">{{ t("SUBTOTAL") }}</div>
              <div class="text-sm font-regular text-nowrap">{{ getFormatAmount(totalPriceWithoutDiscount) }} so'm</div>
            </div>
            <div class="flex justify-between p-[9px] border-y-[1px] border-solid border-gray-line gap-4">
              <div class="text-sm font-regular text-nowrap">{{ t("DISCOUNT") }}</div>
              <div class="text-sm font-regular text-nowrap">{{ getFormatAmount(discountPrice) }} so'm</div>
            </div>
            <div class="flex justify-between p-[9px] gap-4">
              <div class="text-sm font-semibold text-nowrap">{{ t("TOTALS") }}</div>
              <div class="text-sm font-semibold text-nowrap">{{ getFormatAmount(totalPrice) }} so'm</div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex justify-end" v-if="!visitId">
      <button @click="submitForm(formRef)" :class="{ 'pointer-events-none': loading }">
        <v-button type="primary" size="xlarge" :loading="loading">{{ t("SAVE") }}</v-button>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Axios, AxiosInstance } from "axios";
import { dayjs, type FormInstance } from "element-plus";
import { debounce, get } from "lodash";
import { Search } from "@element-plus/icons-vue";
import type { IDepartmentListItem } from "~/types/department/index.type";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const tableIndex = ref(0);
const loading = ref(false);
const tabStore = useUrlTabStore();
const route = useRoute();
const router = useRouter();
const visitId = computed(() => route.params?.id);
const patientId = computed(() => route.params?.patientId);
const doctors = ref<any>([]);
const allServices = ref([]);
const services = ref<any>([]);
const patients = ref([]);
const selectLoading = ref(false);
const departments = ref([]);
const departmentId = ref(null);
const rules: any = {
  startDate: [{ required: true, message: "", trigger: "change" }],
  // items: [{ validator: validateItems, trigger: "blur" }],
};
// const paymentTypes = useConstants().PAYMENT_TYPES.map((elem) => {
//   return {
//     code: elem,
//   };
// });

const totalPrice = computed(() => {
  let total = 0;
  form.items.forEach((elem: any) => {
    const findService: any = allServices.value.find((service: any) => service.id === elem.serviceId);
    if (findService)
      total += findService.price * elem.quantity - findService.price * elem.quantity * (elem.discount / 100);
  });
  return total || 0;
});
const totalPriceWithoutDiscount = computed(() => {
  let total = 0;
  form.items.forEach((elem: any) => {
    const findService: any = allServices.value.find((service: any) => service.id === elem.serviceId);
    if (findService) total += findService.price * elem.quantity;
  });
  return total || 0;
});
const discountPrice = computed(() => totalPriceWithoutDiscount.value - totalPrice.value);

const form = reactive({
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
  // paymentType: "",
});
itemsValidator();
const changeDepartment = () => {
  getServices();
};
const getDepartments = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined, tur: string) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createVisit();
  });
};
function itemsValidator() {
  form.items.forEach((_, index) => {
    rules[`items.${index}.serviceId`] = [{ required: true, message: t("SELECT_SERVICE"), trigger: "change" }];
    rules[`items.${index}.doctorId`] = [{ required: true, message: t("SELECT_DOCTOR"), trigger: "change" }];
    rules[`items.${index}.quantity`] = [
      { required: true, type: "number", message: t("ENTER_QUANTITY"), trigger: "blur" },
    ];
  });
  tableIndex.value++;
}
const createFormItem = () => {
  form.items.push({
    serviceId: "",
    quantity: "",
    discount: "",
    doctorId: "",
  });
  itemsValidator();
};

const deleteItem = (index: number) => {
  form.items = form.items.filter((_, i) => i !== index);
  itemsValidator();
};
async function createVisit() {
  loading.value = true;
  const id = visitId.value;
  const url = id ? `/api/visit/update` : "/api/visit/create";
  const startDate = dayjs(form.startDate).format("YYYY-MM-DDTHH:mm:ssZ").replace("+05:00", "");
  const method = id ? "put" : "post";
  (<Axios>$axios)
    [method](url, { ...form, items: form.items.filter((i) => i.serviceId && i.doctorId), id, startDate })
    .then((res) => {
      notificationShower("success", id ? t("VISIT_UPDATE_SUCCESS") : t("VISIT_CREATED_SUCCESS"));
      tabStore.removeUrl(route.fullPath);
      router.push(`/patients/${patientId.value}?tab=history`);
    })
    .finally(() => {
      loading.value = false;
    });
}
const remoteDepartmentMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getDepartments(queryData);
}, 300);
const remoteServiceMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getServices(queryData);
}, 300);
const remoteDoctorMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) getDoctors(queryData);
}, 300);
const getDoctors = async (queryData?: { searchKey: string }) => {
  try {
    selectLoading.value = true;
    const response = await (<Axios>$axios).post("/api/user/list", {
      ...queryData,
      role: "DOCTOR",
      status: "AVAILABLE",
    });
    const data = response?.data?.payload?.list;
    doctors.value = data.map((elem: any) => {
      return {
        name: `${elem.firstName ?? ""} ${elem.lastName ?? ""} ${elem.middleName ?? ""}`.trim(),
        ...elem,
      };
    });
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    selectLoading.value = false;
  }
};

const getServices = async (queryData?: { searchKey: string }) => {
  try {
    selectLoading.value = true;
    const response = await (<Axios>$axios).post("/api/service/list", {
      ...queryData,
      departmentId: departmentId.value || undefined,
    });
    const data = response?.data?.payload?.list;
    services.value = data;
    services.value.forEach((elem: any) => {
      if (!allServices.value.find((service) => service.id === elem.id)) allServices.value.push(elem);
    });
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    selectLoading.value = false;
  }
};
const getPatientById = async () => {
  loading.value = true;
  (<AxiosInstance>$axios)
    .get(`/api/patient/summary/${patientId.value}`)
    .then((res) => {
      patients.value.push(res.data.payload);
    })
    .finally(() => {
      loading.value = false;
    });
};
const getDepartmentById = async () => {
  (<Axios>$axios).get(`/api/visit/summary/${visitId.value}`).then((res) => {
    form.startDate = res.data.payload.startDate;
    form.items = res.data.payload.items.map((elem: any) => {
      const findDoc = doctors.value.find((doc) => doc.id === elem.doctor.id);
      if (!findDoc && elem.doctor) doctors.value.push(elem.doctor);
      const findService = services.value.find((service) => service.id === elem.service.id);
      if (!findService && elem.service) services.value.push(elem.service);
      return {
        serviceId: elem.service.id,
        quantity: elem.quantity,
        discount: elem.discount,
        doctorId: elem.doctor.id,
      };
    });
    form.paymentType = res.data.payload.paymentType;
  });
};

onMounted(() => {
  getDepartments();
  if (visitId.value) getDepartmentById();
  if (tabStore.getData(route.fullPath)) {
    Object.assign(form, tabStore.getData(route.fullPath));
    getDoctors();
    getServices();
  }
  if (!form.startDate) form.startDate = new Date().toDateString();
  tableIndex.value++;
  getPatientById();
});
onUnmounted(() => {
  tabStore.updateData(route.fullPath, form);
});
</script>

<style scoped>
:deep(.el-table tr:hover) {
  background: white !important;
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
  background: white !important;

}
:deep(.el-table th.el-table__cell) {
  background-color: white !important;
}
:deep(tbody tr td) {
  border-right: 1px solid #f0f0f0 !important;
  border-top: 1px solid #f0f0f0 !important;
  padding: 0 !important;
}

:deep(tbody tr td .el-select__wrapper),
:deep(tbody tr td .el-input__wrapper) {
  box-shadow: none !important;
  border: 0 !important;
}
:deep(tbody tr td:first-child) {
  border-left: 1px solid #f0f0f0 !important;
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
