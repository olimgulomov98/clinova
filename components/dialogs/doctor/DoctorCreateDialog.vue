<template>
  <div class="p-6">
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <v-form-title
        class="mb-6 border-b flex items-center gap-2 cursor-pointer pb-3"
        @click="collapsePersonal = !collapsePersonal"
      >
        <el-icon>
          <component :is="collapsePersonal ? ArrowDown : ArrowUp" />
        </el-icon>
        <span>{{ t("EMPLOYEE_INFORMATION") }}</span>
      </v-form-title>

      <transition name="fade">
        <div v-show="!collapsePersonal">
          <div class="grid grid-cols-3 gap-4">
            <div class="grid grid-cols-1 gap-4">
              <el-form-item
                :label="t('FIRST_NAME')"
                prop="firstName"
                class="custom-form-item"
              >
                <el-input v-model="form.firstName" class="no-radius-input" />
              </el-form-item>
              <el-form-item
                :label="t('LAST_NAME')"
                prop="lastName"
                class="custom-form-item"
              >
                <el-input v-model="form.lastName" class="no-radius-input" />
              </el-form-item>
              <el-form-item
                :label="t('BIRTH_DATE')"
                prop="dateOfBirth"
                class="custom-form-item"
              >
                <el-input
                  v-model="form.dateOfBirth"
                  type="date"
                  class="no-radius-input"
                  @change="calculateAge"
                />
              </el-form-item>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <el-form-item
                :label="t('GENDER')"
                prop="question"
                class="custom-form-item"
              >
                <div class="rounded-lg bg-gray-bg px-[10px] flex">
                  <div v-for="gender in genders">
                    <v-button
                      type="primary"
                      size="default"
                      v-if="form.gender == gender.value"
                      @click="form.gender = gender.value"
                    >
                      {{ gender.label }}
                    </v-button>
                    <v-button
                      size="default"
                      v-if="form.gender !== gender.value"
                      @click="form.gender = gender.value"
                    >
                      {{ gender.label }}
                    </v-button>
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                :label="t('PHONE_NUMBER')"
                prop="phone"
                class="custom-form-item"
              >
                <el-input
                  v-model="form.phone"
                  v-mask="'+998 ## ### ## ##'"
                  class="no-radius-input black-placeholder"
                  placeholder="+998"
                />
              </el-form-item>
              <el-form-item :label="t('AGE')" class="custom-form-item">
                <el-input v-model="age" readonly class="no-radius-input" />
              </el-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex justify-center mt-8">
                <img
                  :src="frameImage"
                  alt="Employee photo"
                  class="w-52 h-52 object-cover"
                />
              </div>
            </div>

            <el-form-item
              :label="t('ADDRESS')"
              prop="address"
              class="col-span-2 custom-form-item"
            >
              <el-input v-model="form.address" type="textarea" :rows="4" />
            </el-form-item>
          </div>
        </div>
      </transition>

      <v-form-title
        class="mb-6 border-b flex items-center gap-2 cursor-pointer pb-3"
        @click="collapseDepartment = !collapseDepartment"
      >
        <el-icon>
          <component :is="collapseDepartment ? ArrowDown : ArrowUp" />
        </el-icon>
        <span>{{ t("EMPLOYEE_INFORMATION") }}</span>
      </v-form-title>

      <transition name="fade">
        <div v-show="!collapseDepartment">
          <div class="grid grid-cols-3 gap-4">
            <el-form-item
              :label="t('Position')"
              prop="specialization"
              class="custom-form-item"
            >
              <el-input v-model="form.specialization" class="no-radius-input" />
            </el-form-item>
            <el-form-item
              :label="t('DEPARTMENT')"
              prop="departmentId"
              class="custom-form-item"
            >
              <v-select
                v-model="form.departmentId"
                filterable
                class="no-radius-select"
                :options="departments"
                label-key="name"
                value-key="id"
                remote
                :suffix-icon="Search"
                remote-show-suffix
                :loading="loading"
                :placeholder="t('SEARCH_AND_SELECT_DEPARTMENT')"
              />
            </el-form-item>
            <el-form-item
              :label="t('STATUS')"
              prop="status"
              class="custom-form-item"
            >
              <v-select
                v-model="form.status"
                class="no-radius-select"
                :options="statuses"
                label-key="label"
                value-key="value"
              />
            </el-form-item>
          </div>
        </div>
      </transition>

      <v-form-title
        class="mb-6 border-b flex items-center gap-2 cursor-pointer pb-3"
        @click="collapsePayments = !collapsePayments"
      >
        <el-icon>
          <component :is="collapsePayments ? ArrowDown : ArrowUp" />
        </el-icon>
        <span>{{ t("PAYMENTS_TABLE") }}</span>
      </v-form-title>

      <transition name="fade">
        <div v-show="!collapsePayments" class="mb-5">
          <div class="grid grid-cols-2 gap-12">
            <el-form-item prop="servicePercents">
              <el-table :data="form.servicePercents" style="width: 100%">
                <el-table-column :label="t('SERVICE')">
                  <template #default="scope">
                    <el-form-item
                      :prop="`servicePercents.${scope.$index}.serviceId`"
                    >
                      <v-select
                        v-model="scope.row.serviceId"
                        :options="services"
                        filterable
                        label-key="name"
                        value-key="id"
                        remote
                        :loading="loading"
                        :suffix-icon="Search"
                        remote-show-suffix
                        :placeholder="t('SEARCH_AND_SELECT_DEPARTMENT')"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <!-- AMOUNT / % column -->
                <el-table-column :label="t('AMOUNT')">
                  <template #default="scope">
                    <el-form-item
                      :prop="`servicePercents.${scope.$index}.percent`"
                    >
                      <v-input
                        v-model.number="scope.row.percent"
                        type="number"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <!-- Delete / Add row -->
                <el-table-column align="right" width="60">
                  <template #default="scope">
                    <div
                      v-if="form.servicePercents.length !== scope.$index + 1"
                      class="flex items-center justify-center w-full gap-x-5 cursor-pointer float-right"
                      @click="removePayment(scope.$index)"
                    >
                      <icon-trash />
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-center w-full gap-x-5 cursor-pointer float-right"
                      @click="addPayment"
                    >
                      <icon-plus />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <!-- BASIC SALARY -->
            <div class="flex items-end">
              <el-form-item
                :label="t('Basic_Salary')"
                prop="basicSalary"
                class="custom-form-item"
                style="width: 50%"
              >
                <el-input
                  v-model="form.basicSalary"
                  type="number"
                  size="large"
                  class="no-radius-input"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </transition>

      <v-form-title
        class="mb-6 border-b flex items-center gap-2 cursor-pointer pb-3"
        @click="collapseBasic = !collapseBasic"
      >
        <el-icon>
          <component :is="collapseBasic ? ArrowDown : ArrowUp" />
        </el-icon>
        <span>{{ t("BASIC_INFO") }}</span>
      </v-form-title>

      <transition name="fade">
        <div v-show="!collapseBasic">
          <div class="grid grid-cols-2 gap-4">
            <div class="w-1/2">
              <el-form-item
                :label="t('Login')"
                prop="username"
                class="custom-form-item"
              >
                <el-input v-model="form.username" class="no-radius-input" />
              </el-form-item>
              <el-form-item
                :label="t('PASSWORD')"
                prop="password"
                class="custom-form-item"
              >
                <el-input v-model="form.password" class="no-radius-input" />
              </el-form-item>
            </div>

            <div>
              <el-form-item
                :label="t('ROLES')"
                prop="roles"
                class="roles-form-item"
              >
                <div class="scroll-wrapper">
                  <div class="role-list flex flex-wrap">
                    <el-checkbox-group v-model="form.roles">
                      <el-checkbox
                        v-for="role in roleOptions"
                        :key="role"
                        :label="role"
                        class="custom-checkbox role-item"
                      >
                        {{ role }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </transition>

      <div class="flex justify-end mt-6">
        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="large_btn"
        >
          {{ t("SAVE") }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AxiosInstance } from "axios";
import type { IDoctorCreate } from "~/types/doctor/index.type";
import type { IDepartmentListItem } from "~/types/department/index.type";
import type { IServiceCreate } from "~/types/service/index.type";
import { ArrowDown, ArrowUp, Delete, Search } from "@element-plus/icons-vue";
import frameImage from "~/assets/icons/frame8.svg?url";

const route = useRoute();
const router = useRouter();
const collapseBasic = ref(false);
const collapsePersonal = ref(false);
const collapseDepartment = ref(false);
const collapsePayments = ref(false);
const { t } = useI18n();
const { $axios } = useNuxtApp();
const { phoneNumberValidator } = useValidators();
const doctorId = computed(() => Number(route.params?.doctorId) || undefined);
const genders = computed(() => {
  return [
    { label: t("MALE"), value: "MALE" },
    { label: t("FEMALE"), value: "FEMALE" },
  ];
});

const rules = {
  // username: [{ required: true, message: "", trigger: "change" }],
  // password: [
  //   { required: !doctorId.value, message: "", trigger: "change" },
  //   { min: 5, message: t("PASSWORD_MESSAGE"), trigger: "blur" },
  // ],
  // firstName: [{ required: true, message: "", trigger: "change" }],
  // lastName: [{ required: true, message: "", trigger: "change" }],
  // phone: [
  //   { required: true, message: "", trigger: "change" },
  //   {
  //     validator: phoneNumberValidator,
  //     message: t("VALID_PHONE"),
  //     trigger: "blur",
  //   },
  // ],
  // dateOfBirth: [{ required: true, message: "", trigger: "change" }],
  // specialization: [{ required: true, message: "", trigger: "change" }],
  // departmentId: [{ required: true, message: "", trigger: "change" }],
  // status: [{ required: true, message: "", trigger: "change" }],
};

const departments = ref<IDepartmentListItem[]>([]);
const services = ref<IServiceCreate[]>([]);
const loading = ref(false);
const age = ref<any>("");
const form = reactive<Partial<IDoctorCreate>>({
  username: "",
  password: undefined,
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  dateOfBirth: "",
  specialization: "",
  departmentId: undefined,
  roles: [],
  status: "AVAILABLE",
  servicePercents: [
    {
      serviceId: "",
      percent: "",
    },
  ],
  basicSalary: "",
  gender: "",
  address: "",
});
const formRef = ref<FormInstance>();

const roleOptions = ref<{ id: number; name: string }[]>([]);

const getRoles = async () => {
  const { data } = await (<AxiosInstance>$axios).get("/api/user/roles");
  roleOptions.value = data.payload || [];
};

const statuses = useConstants().DOCTOR_STATUSES?.map((i) => ({
  label: t(i),
  value: i,
}));

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    await createDoctor();
  });
};

async function createDoctor() {
  loading.value = true;
  const id = doctorId.value;
  const url = id ? `/api/user/update` : "/api/user/create";
  const method = id ? "put" : "post";
  try {
    const cleanedServicePercents = form.servicePercents.filter(
      (item) => item.serviceId && item.percent
    );
    await (<AxiosInstance>$axios)[method](url, {
      ...form,
      id,
      phone: cleanPhoneNumber(form.phone || ""),
      servicePercents: cleanedServicePercents,
    });

    notificationShower(
      "success",
      id ? t("EMPLOYEE_UPDATE_SUCCESS") : t("EMPLOYEE_CREATED_SUCCESS")
    );
    router.push("/doctors");
  } finally {
    loading.value = false;
  }
}

const getDoctorById = async () => {
  const { data } = await (<AxiosInstance>$axios).get(
    `/api/user/summary/${doctorId.value}`
  );

  const roles = data.payload.authorities?.length
    ? data.payload.authorities.map((a: any) => a.authority)
    : [];

  const d = data.payload;
  form.username = d.username;
  form.firstName = d.firstName;
  form.lastName = d.lastName;
  form.middleName = d.middleName;
  form.gender = d.gender;
  form.address = d.address;
  form.phone = d.phone;
  form.dateOfBirth = d.dateOfBirth;
  form.specialization = d.specialization;
  form.departmentId = d.department?.id;
  form.status = d.status;
  form.basicSalary = d.basicSalary;
  form.roles = roles;
  form.servicePercents =
    d.servicePercents && d.servicePercents.length
      ? d.servicePercents.map((item: any) => ({
          serviceId: item.service?.id || "",
          percent: item.percent || "",
        }))
      : [{ serviceId: "", percent: "" }];
  calculateAge();
};

const getDepartments = async () => {
  loading.value = true;
  try {
    const res = await (<AxiosInstance>$axios).post("/api/department/list", {
      size: 500,
    });
    departments.value = res.data.payload?.list || [];
  } finally {
    loading.value = false;
  }
};

const getServices = async (query = "") => {
  loading.value = true;
  try {
    const res = await (<AxiosInstance>$axios).post("/api/service/list", {
      size: 500,
      search: query,
    });
    services.value = res.data.payload?.list || [];
  } finally {
    loading.value = false;
  }
};

const calculateAge = () => {
  const today = new Date();
  const birthDate = new Date(form.dateOfBirth as string);
  const ageDifMs = today.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  age.value = Math.abs(ageDate.getUTCFullYear() - 1970);
};

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const addPayment = () => {
  form.servicePercents.push({ serviceId: "", percent: "" });
};

const removePayment = (index: number) => {
  if (form.servicePercents.length > 1) {
    form.servicePercents.splice(index, 1);
  }
};

onMounted(() => {
  getRoles();
  getDepartments();
  getServices();
  if (doctorId.value) getDoctorById();
});
</script>

<style scoped>
::v-deep(.custom-form-item .el-form-item__label) {
  color: #757575;
  font-weight: 400;
}

::v-deep(.no-radius-input .el-input__wrapper) {
  border-radius: 0 !important;
}

::v-deep(.no-radius-select .el-select__wrapper) {
  border-radius: 0 !important;
}

.black-placeholder ::placeholder {
  color: #000 !important;
  opacity: 1;
}

/* for paytments table */
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

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  background-color: white;
  border-color: #a7aaad !important;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  color: #757575;
}

/* for roles */
.role-list {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.role-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  color: #4b5563;
  margin-right: 0;
}

.role-item:last-child {
  border-bottom: none;
}

.button-margin {
  margin-top: 30px;
}

::v-deep(.custom-checkbox.is-checked) {
  background-color: transparent !important;
}

::v-deep(.custom-checkbox .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #facc15 !important;
  border-color: #facc15 !important;
}

::v-deep(.custom-checkbox) {
  min-width: 400px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.role-list::-webkit-scrollbar {
  width: 6px;
}

.role-list::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.role-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

@supports (scrollbar-width: thin) {
  .role-list {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f3f4f6;
  }
}
</style>
