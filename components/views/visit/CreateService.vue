<template>
  <div class="flex flex-col gap-10">
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      class="flex flex-col justify-between h-full"
      :rules="rules"
      v-auto-animate
    >
      <div class="grid grid-cols-3 gap-6 max-w-[50%]">
        <!-- <el-form-item class="!mb-0" :label="t('PAYMENT_TYPE')" prop="paymentType">
          <v-select
            v-model="paymentType"
            :options="paymentTypes"
            filterable
            label-key="code"
            value-key="code"
          ></v-select>
        </el-form-item> -->
        <el-form-item
          class="!mb-0"
          :label="t('VISIT_NUMBER')"
          prop="paymentType"
        >
          <v-input :model-value="visit?.code" disabled />
        </el-form-item>
        <el-form-item class="!mb-0" :label="t('DATE')" prop="paymentType">
          <v-input
            :model-value="
              dayjs(visit?.startDate + '+05:00').format('DD.MM.YYYY')
            "
            disabled
          />
        </el-form-item>
      </div>
      <div class="visit-create-page-container">
        <el-form-item class="!mb-0" prop="items">
          <el-table :data="form.items" :key="tableIndex" style="width: 99%">
            <el-table-column :label="t('DEPARTMENT')">
              <template #default="scope">
                <el-form-item>
                  <v-select
                    filterable
                    v-model="scope.row.departmentId"
                    :options="departments"
                    label-key="name"
                    value-key="id"
                    :placeholder="t('DEPARTMENT')"
                    class="form_select"
                    @change="(value) => changeDepartment(value, scope.$index)"
                    :remote-method="remoteDepartmentMethod"
                    :loading="selectLoading"
                    :suffix-icon="Search"
                    remote-show-suffix
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="t('SUB_DEPARTMENT')">
              <template #default="scope">
                <el-form-item :prop="''">
                  <v-select
                    v-model="scope.row.subDepartmentId"
                    :options="getSubDepartments(scope.$index)"
                    filterable
                    label-key="name"
                    value-key="id"
                    :placeholder="t('SUB_DEPARTMENT')"
                    class="form_select"
                    :disabled="!getSubDepartments(scope.$index).length"
                    :suffix-icon="Search"
                    remote-show-suffix
                    @change="
                      (value) => changeSubDepartment(value, scope.$index)
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('SERVICE')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0
                      ? `items.${scope.$index}.serviceId`
                      : ''
                  "
                >
                  <v-select
                    v-model="scope.row.serviceId"
                    :options="getServicesForRow(scope.$index)"
                    filterable
                    label-key="name"
                    value-key="id"
                    remote
                    :remote-method="
                      (query: string) => remoteServiceMethod(query, scope.$index)
                    "
                    :loading="selectLoading"
                    :suffix-icon="Search"
                    remote-show-suffix
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('DOCTOR')">
              <template #default="scope">
                <el-form-item :prop="''">
                  <v-select
                    v-model="scope.row.doctorId"
                    :options="getDoctorsForRow(scope.$index)"
                    filterable
                    label-key="name"
                    value-key="id"
                    remote
                    :remote-method="
                      (query: string) => remoteDoctorMethod(query, scope.$index)
                    "
                    :loading="selectLoading"
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
                    scope.$index + 1 !== form.items.length || scope.$index == 0
                      ? `items.${scope.$index}.quantity`
                      : ''
                  "
                >
                  <v-input
                    v-model.number="scope.row.quantity"
                    type="number"
                    @keypress="handleKeyPress"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column :label="t('DISCOUNT')">
              <template #default="scope">
                <el-form-item
                  :prop="
                    scope.$index + 1 !== form.items.length || scope.$index == 0
                      ? `items.${scope.$index}.discount`
                      : ''
                  "
                >
                  <v-input v-model.number="scope.row.discount" type="number" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="right" width="60">
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
              <div class="text-sm font-regular text-nowrap">
                {{ t("SUBTOTAL") }}
              </div>
              <div class="text-sm font-regular text-nowrap">
                {{ getFormatAmount(totalPriceWithoutDiscount) }} so'm
              </div>
            </div>
            <div
              class="flex justify-between p-[9px] border-y-[1px] border-solid border-gray-line gap-4"
            >
              <div class="text-sm font-regular text-nowrap">
                {{ t("DISCOUNT") }}
              </div>
              <div class="text-sm font-regular text-nowrap">
                {{ getFormatAmount(discountPrice) }} so'm
              </div>
            </div>
            <div class="flex justify-between p-[9px] gap-4">
              <div class="text-sm font-semibold text-nowrap">
                {{ t("TOTALS") }}
              </div>
              <div class="text-sm font-semibold text-nowrap">
                {{ getFormatAmount(totalPrice) }} so'm
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex justify-end">
      <button
        @click="submitForm(formRef, '')"
        :class="{ 'pointer-events-none opacity-50': loading }"
      >
        <v-button type="primary" size="xlarge" :loading="loading">{{
          t("SAVE")
        }}</v-button>
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
const allServices = ref<any[]>([]);
const services = ref<any>([]);
const patients = ref<any[]>([]);
const selectLoading = ref(false);
const departments = ref<IDepartmentListItem[]>([]);
const departmentId = ref(null);
const paymentType = ref(null);
const visit = ref<any>(null);
const rowServices = ref<any[]>([]);
const rowDoctors = ref<any[]>([]);
const rules: any = {
  startDate: [{ required: true, message: "", trigger: "change" }],
  // items: [{ validator: validateItems, trigger: "blur" }],
};
const paymentTypes = useConstants().PAYMENT_TYPES.map((elem) => {
  return {
    code: elem,
  };
});

const totalPrice = computed(() => {
  let total = 0;
  form.items.forEach((elem: any) => {
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
  form.items.forEach((elem: any) => {
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

const form = reactive({
  startDate: "",
  patientId: patientId.value,
  items: [
    {
      doctors: [],
      services: [],
      departmentId: "",
      subDepartmentId: "",
      serviceId: "",
      quantity: "",
      discount: "",
      doctorId: "",
    },
  ],
});

itemsValidator();

const changeDepartment = (departmentId: any, rowIndex: number) => {
  const dep = departments.value.find((d: any) => d.id === departmentId);

  // Update the specific row's data
  form.items[rowIndex].subDepartmentId = "";
  form.items[rowIndex].serviceId = "";
  form.items[rowIndex].doctorId = "";

  // Get services and doctors for this specific row
  getServicesForRowIndex(rowIndex, departmentId);
  getDoctorsForRowIndex(rowIndex, departmentId);

  itemsValidator();
};

const getDepartments = (queryData?: { searchKey: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, showAll: false, size: 500 })
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
  // reset dynamic item rules (doctor optional)
  Object.keys(rules)
    .filter((key) => key.startsWith("items."))
    .forEach((key) => delete rules[key]);

  form.items.forEach((_, index) => {
    rules[`items.${index}.serviceId`] = [
      { required: true, message: t("SELECT_SERVICE"), trigger: "change" },
    ];
    rules[`items.${index}.quantity`] = [
      {
        required: true,
        validator: (_: any, value: any, callback: any) => {
          if (value === "" || value === null || value === undefined) {
            callback(new Error(t("ENTER_QUANTITY")));
          } else if (!Number.isInteger(value)) {
            callback(new Error(t("QUANTITY_MUST_BE_INTEGER")));
          } else if (value <= 0) {
            callback(new Error(t("QUANTITY_MUST_BE_POSITIVE")));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ];
  });
  tableIndex.value++;
}

function handleKeyPress(event: KeyboardEvent) {
  const char = event.key;
  // Raqam emas yoki nol bo‘lsa bloklaymiz
  if (!/[0-9]/.test(char)) {
    event.preventDefault();
  }
}

const createEmptyItem = () => ({
  doctors: [],
  services: [],
  departmentId: "",
  subDepartmentId: "",
  serviceId: "",
  doctorId: "",
  quantity: "",
  discount: "",
});

const createFormItem = () => {
  form.items.push(createEmptyItem()); // har safar fresh obyekt
  // Initialize empty arrays for the new row
  rowServices.value.push([]);
  rowDoctors.value.push([]);
  itemsValidator();
};

const deleteItem = (index: number) => {
  form.items = form.items.filter((_, i) => i !== index);
  itemsValidator();
};

const getSubDepartments = (rowIndex: number) => {
  const departmentId = form.items[rowIndex]?.departmentId;
  if (!departmentId) return [];
  const department = departments.value.find(
    (d: any) => d.id === departmentId
  ) as any;
  return department?.subDepartments || [];
};

const getServicesForRow = (rowIndex: number) => {
  return rowServices.value[rowIndex] || [];
};

const getDoctorsForRow = (rowIndex: number) => {
  return rowDoctors.value[rowIndex] || [];
};

// Per-row doctor fetching
const getDoctorsForRowIndex = async (rowIndex: number, departmentId: any) => {
  try {
    selectLoading.value = true;

    const response = await (<Axios>$axios).post("/api/user/list", {
      role: "DOCTOR",
      status: "AVAILABLE",
      departmentId: departmentId || undefined,
      size: 999,
    });
    const data = response?.data?.payload?.list;

    // Update the specific row's doctors
    rowDoctors.value[rowIndex] =
      data?.map((elem: any) => {
        return {
          name: `${elem.firstName ?? ""} ${elem.lastName ?? ""} ${
            elem.middleName ?? ""
          }`.trim(),
          ...elem,
        };
      }) || [];
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
    rowDoctors.value[rowIndex] = [];
  } finally {
    selectLoading.value = false;
  }
};

const changeSubDepartment = (subDepartmentId: string, index: number) => {
  form.items[index].serviceId = "";
  form.items[index].doctorId = "";

  const departmentId = form.items[index]?.departmentId;
  getServicesForRowIndex(index, departmentId, subDepartmentId);
  getDoctorsForRowIndex(index, departmentId);
};
async function createVisit() {
  loading.value = true;
  const data = form.items
    .map((item) => {
      const { services, departmentId, doctors, ...rest } = item;
      return {
        ...rest,
      };
    })
    .filter((i) => i.serviceId);
  const id = visitId.value;
  const url = `/api/visit/add-service/${id}`;
  const method = "post";
  (<Axios>$axios)
    [method](url, data)
    .then((res) => {
      notificationShower(
        "success",
        id ? t("VISIT_UPDATE_SUCCESS") : t("VISIT_CREATED_SUCCESS")
      );
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
const remoteServiceMethod = debounce((query: string, rowIndex: number) => {
  const queryData = { searchKey: query };
  if (query.length > 0) {
    const departmentId = form.items[rowIndex]?.departmentId;
    const subDepartmentId = form.items[rowIndex]?.subDepartmentId;
    getServicesForRowIndex(rowIndex, departmentId, subDepartmentId);
  }
}, 300);
const remoteDoctorMethod = debounce((query: string, rowIndex: number) => {
  const queryData = { searchKey: query };
  if (query.length > 0) {
    const departmentId = form.items[rowIndex]?.departmentId;
    getDoctorsForRowIndex(rowIndex, departmentId);
  }
}, 300);
const getDoctors = async (
  queryData?: { searchKey?: string; departmentId?: string },
  index: number = 0
) => {
  try {
    selectLoading.value = true;
    const departmentId =
      queryData?.departmentId || form.items[index]?.departmentId || undefined;
    const response = await (<Axios>$axios).post("/api/user/list", {
      ...queryData,
      role: "DOCTOR",
      status: "AVAILABLE",
      departmentId,
      size: 999,
    });
    const data = response?.data?.payload?.list;
    form.items[index].doctors = data.map((elem: any) => {
      return {
        name: `${elem.firstName ?? ""} ${elem.lastName ?? ""} ${
          elem.middleName ?? ""
        }`.trim(),
        ...elem,
      };
    });
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    selectLoading.value = false;
  }
};

// Per-row service fetching
const getServicesForRowIndex = async (
  rowIndex: number,
  departmentId: any,
  subDepartmentId?: any
) => {
  try {
    selectLoading.value = true;

    const targetDepartmentId = subDepartmentId || departmentId;

    const response = await (<Axios>$axios).post("/api/service/list", {
      departmentId: targetDepartmentId || undefined,
    });
    const data = response?.data?.payload?.list;

    // Update the specific row's services
    rowServices.value[rowIndex] = data || [];

    // Add to all services for price calculation
    data?.forEach((elem: any) => {
      if (!allServices.value.find((service: any) => service.id === elem.id))
        allServices.value.push(elem);
    });
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
    rowServices.value[rowIndex] = [];
  } finally {
    selectLoading.value = false;
  }
};

const getServices = async (
  queryData?: {
    searchKey?: string;
    departmentId?: string;
    subDepartmentId?: string;
  },
  index: number = 0
) => {
  try {
    selectLoading.value = true;
    const response = await (<Axios>$axios).post("/api/service/list", {
      ...queryData,
      size: 999,
    });
    const data = response?.data?.payload?.list;
    form.items[index].services = data;
    form.items[index].services.forEach((elem: any) => {
      if (!allServices.value.find((service) => service.id === elem.id))
        allServices.value.push(elem);
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
    visit.value = res.data.payload;
    // form.items = res.data.payload.items.map((elem: any) => {
    //   const findDoc = doctors.value.find((doc) => doc.id === elem.doctor.id);
    //   if (!findDoc && elem.doctor) doctors.value.push(elem.doctor);
    //   const findService = services.value.find((service) => service.id === elem.service.id);
    //   if (!findService && elem.service) services.value.push(elem.service);
    //   return {
    //     serviceId: elem.service.id,
    //     quantity: elem.quantity,
    //     discount: elem.discount,
    //     doctorId: elem.doctor.id,
    //   };
    // });
  });
};

onMounted(() => {
  getDepartments();
  if (visitId.value) getDepartmentById();
  if (tabStore.getData(route.fullPath)) {
    Object.assign(form, tabStore.getData(route.fullPath));
  }
  getServices();
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
:deep(
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
  ) {
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
