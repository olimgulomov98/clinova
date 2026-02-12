<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      class="flex flex-col justify-between h-full"
      :rules="rules"
      v-auto-animate
      @submit.prevent="submitForm(formRef)"
    >
      <div class="visit-create-page-container">
        <div class="grid grid-cols-3 gap-6 mb-6">
          <el-form-item
            class="!mb-0"
            :label="t('PATIENT')"
            prop="patientId"
            required
          >
            <v-input
              :model-value="
                patients[0]?.name ||
                patients[0]?.firstName + ' ' + patients[0]?.lastName
              "
              disabled
            >
            </v-input>
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('DOCTOR')" prop="doctor">
            <v-select
              v-model="form.doctor"
              :options="doctors"
              filterable
              label-key="name"
              value-key="id"
              :placeholder="t('SELECT_DOCTOR')"
              class="form_select"
              :remote-method="remoteDoctorMethod"
              :loading="selectLoading"
              :suffix-icon="Search"
              remote-show-suffix
            />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">
          <el-form-item
            class="!mb-0"
            :label="t('ROOM_NUMBER')"
            prop="roomNumber"
            required
          >
            <v-select
              v-model="form.roomNumber"
              :options="rooms"
              filterable
              label-key="number"
              value-key="id"
              :placeholder="t('SELECT_ROOM')"
              class="form_select"
              @change="onRoomChange"
            />
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('BEDS')" prop="bedId" required>
            <v-select
              v-model="form.bedId"
              :options="bedOptions"
              filterable
              label-key="label"
              value-key="value"
              class="form_select"
              :placeholder="t('SELECT_BED')"
            />
          </el-form-item>
          <el-form-item
            class="!mb-0"
            :label="t('DISCOUNT') + ' (%)'"
            prop="discount"
          >
            <v-input v-model.number="form.discount" type="number" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">
          <el-form-item
            class="!mb-0"
            :label="t('DAY_COUNT')"
            prop="dayCount"
            required
          >
            <v-input v-model.number="form.dayCount" type="number" />
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('START_DATE')">
            <v-date-picker v-model="form.startDate" format="DD.MM.YYYY" />
          </el-form-item>

          <el-form-item class="!mb-0" :label="t('END_DATE')" prop="endDate">
            <v-date-picker v-model="form.endDate" format="DD.MM.YYYY" />
          </el-form-item>
        </div>
        <div class="flex justify-end">
          <div class="max-w-fit w-full">
            <div class="flex justify-between p-[9px] gap-4">
              <div class="text-sm font-regular text-nowrap">
                {{ t("SUBTOTAL") }}
              </div>
              <div class="text-sm font-regular text-nowrap">
                {{ getFormatAmount(totalPriceWithoutDiscount) }}
                {{ t("CURRENCY_SOM") }}
              </div>
            </div>
            <div
              class="flex justify-between p-[9px] border-y-[1px] border-solid border-gray-line gap-4"
            >
              <div class="text-sm font-regular text-nowrap">
                {{ t("DISCOUNT") }}
              </div>
              <div class="text-sm font-regular text-nowrap">
                {{ discountPrice > 0 ? "-" : ""
                }}{{ getFormatAmount(discountPrice) }} {{ t("CURRENCY_SOM") }}
              </div>
            </div>
            <div class="flex justify-between p-[9px] gap-4">
              <div class="text-sm font-semibold text-nowrap">
                {{ t("TOTALS") }}
              </div>
              <div class="text-sm font-semibold text-nowrap">
                {{ getFormatAmount(totalPrice) }} {{ t("CURRENCY_SOM") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex justify-end">
      <button
        @click="submitForm(formRef)"
        :class="{ 'pointer-events-none': loading }"
      >
        <v-button type="primary" size="xlarge" :loading="loading">{{
          t("SAVE")
        }}</v-button>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { dayjs, type FormInstance } from "element-plus";
import { debounce } from "lodash";
import { Search } from "@element-plus/icons-vue";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const loading = ref(false);
const tabStore = useUrlTabStore();
const route = useRoute();
const router = useRouter();
const patientId = computed(() => route.params?.patientId);
const doctors = ref<any>([]);
const patients = ref<any>([]);
const rooms = ref<any>([]);
const selectLoading = ref(false);
const rules: any = {
  patientId: [{ required: true, message: "", trigger: "change" }],
  dayCount: [{ required: true, message: "", trigger: "change" }],
  roomNumber: [{ required: true, message: "", trigger: "change" }],
  bedId: [{ required: true, message: "", trigger: "change" }],
};

const bedOptions = ref<any[]>([]);

const selectedRoomPrice = computed(() => {
  if (!form.roomNumber) return 0;
  const selectedRoom = rooms.value.find(
    (room: any) => room.id === form.roomNumber
  );
  return selectedRoom?.price || 0;
});

const totalPriceWithoutDiscount = computed(() => {
  const price = selectedRoomPrice.value;
  const dayCount = Number(form.dayCount) || 0;
  return price * dayCount;
});

const discountPercent = computed(() => Number(form.discount) || 0);

const discountPrice = computed(() => {
  const total = totalPriceWithoutDiscount.value;
  return (total * discountPercent.value) / 100;
});

const totalPrice = computed(() => {
  return Math.max(0, totalPriceWithoutDiscount.value - discountPrice.value);
});

const form = reactive({
  startDate: "",
  endDate: "",
  patientId: patientId.value,
  discount: "",
  roomNumber: null as number | null,
  bedId: null as number | null,
  doctor: null as number | null,
  dayCount: "",
  items: [] as any[],
});

const getRooms = async () => {
  try {
    selectLoading.value = true;
    const response = await (<Axios>$axios).post("/api/room/list", {
      onlyFree: true,
    });
    const data = response?.data?.payload?.list || [];
    rooms.value = data;
  } catch (error: any) {
    rooms.value = [];
  } finally {
    selectLoading.value = false;
  }
};

const onRoomChange = (roomId: number | null) => {
  if (!roomId) {
    bedOptions.value = [];
    form.bedId = null;
    return;
  }

  const selectedRoom = rooms.value.find((room: any) => room.id === roomId);
  if (selectedRoom?.beds && Array.isArray(selectedRoom.beds)) {
    bedOptions.value = selectedRoom.beds.map((bed: any) => {
      const number = bed?.number || bed?.id || "";
      const status = bed?.status || "";
      const statusLabel = status ? t(status) : "";
      const label = status ? `${number} (${statusLabel})` : number;
      return {
        label,
        value: bed?.id || bed?.number || bed,
      };
    });
  } else {
    bedOptions.value = [];
  }
};

const formRef = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (loading.value) return; // Prevent double submission
  formEl.validate(async (valid) => {
    if (!valid) return;
    await createStay();
  });
};

async function createStay() {
  loading.value = true;

  // Format dates to YYYY-MM-DD
  const startDate = form.startDate
    ? dayjs(form.startDate).format("YYYY-MM-DD")
    : "";
  const endDate = form.endDate ? dayjs(form.endDate).format("YYYY-MM-DD") : "";

  // Prepare request body according to API documentation
  const requestBody: any = {
    patientId: Number(patientId.value) || 0,
    bedId: Number(form.bedId) || 0,
    discount: Number(form.discount) || 0,
    dayCount: Number(form.dayCount) || 0,
    startDate: startDate,
    endDate: endDate,
  };

  // Only include doctorId if it's selected
  if (form.doctor) {
    requestBody.doctorId = Number(form.doctor);
  }

  (<Axios>$axios)
    .post("/api/stay/create", requestBody)
    .then((res) => {
      notificationShower("success", t("STAY_CREATED_SUCCESS"));
      tabStore.removeUrl(route.fullPath);
      router.push(`/patients/${patientId.value}?tab=stay`);
    })
    .catch((error) => {
      notificationShower(
        "error",
        error?.response?.data?.message || t("ERROR_OCCURRED")
      );
    })
    .finally(() => {
      loading.value = false;
    });
}

const remoteDoctorMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 0) {
    getDoctors(queryData);
  }
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
        name: `${elem.firstName ?? ""} ${elem.lastName ?? ""} ${
          elem.middleName ?? ""
        }`.trim(),
        ...elem,
      };
    });
  } catch (error: any) {
    // Error handling
  } finally {
    selectLoading.value = false;
  }
};

const getPatientById = async () => {
  loading.value = true;
  (<Axios>$axios)
    .get(`/api/patient/summary/${patientId.value}`)
    .then((res) => {
      patients.value.push(res.data.payload);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getDoctors();
  getRooms();
  getPatientById();
});
</script>

<style scoped>
.visit-create-page-container {
  display: grid;
  grid-gap: 24px;
  flex-flow: column;

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
  background-color: white !important;
  border-color: #a7aaad !important;
  border-width: 1px !important;
  height: 40px !important;
  min-height: 40px !important;
  box-shadow: none !important;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focused),
:deep(.el-select__wrapper.is-focus) {
  border-color: #a7aaad !important;
  box-shadow: 0 0 0 1px #a7aaad inset !important;
}

:deep(.v-date-picker .el-input__wrapper) {
  background-color: white !important;
  border-color: #a7aaad !important;
  border-width: 1px !important;
  height: 40px !important;
  min-height: 40px !important;
  box-shadow: none !important;
}

:deep(.v-date-picker .el-input__wrapper.is-focus) {
  border-color: #a7aaad !important;
  box-shadow: 0 0 0 1px #a7aaad inset !important;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  color: #757575;
}

:deep(.el-input__inner),
:deep(.el-select__wrapper .el-select__selected-item) {
  height: 100% !important;
}

:deep(.el-input__inner),
:deep(.el-input__wrapper .el-input__inner),
:deep(.el-select__wrapper .el-select__selected-item),
:deep(.el-select__wrapper .el-select__selected-item *),
:deep(.el-select__wrapper input),
:deep(.el-date-editor .el-input__inner),
:deep(.el-date-editor .el-input__wrapper .el-input__inner) {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
}
</style>
