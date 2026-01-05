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
        <div class="grid grid-cols-3 gap-6 mb-6">
          <el-form-item
            class="!mb-0"
            :label="t('PATIENT')"
            prop="patientId"
            required
          >
            <v-input :model-value="getPatientName()" disabled> </v-input>
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('DOCTOR')" prop="doctor">
            <v-select
              v-model="form.doctor"
              :options="doctors"
              label-key="name"
              value-key="id"
              :placeholder="t('SELECT_DOCTOR')"
              class="form_select"
              disabled
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
              disabled
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
              disabled
            />
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('DISCOUNT')" prop="discount">
            <v-input v-model.number="form.discount" type="number" disabled />
          </el-form-item>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">
          <el-form-item
            class="!mb-0"
            :label="t('DAY_COUNT')"
            prop="dayCount"
            required
          >
            <v-input v-model.number="form.dayCount" type="number" disabled />
          </el-form-item>
          <el-form-item class="!mb-0" :label="t('START_DATE')">
            <v-date-picker
              v-model="form.startDate"
              format="DD.MM.YYYY"
              disabled
            />
          </el-form-item>

          <el-form-item class="!mb-0" :label="t('END_DATE')" prop="endDate">
            <v-date-picker
              v-model="form.endDate"
              format="DD.MM.YYYY"
              disabled
            />
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
                {{ getFormatAmount(discountPrice) }} {{ t("CURRENCY_SOM") }}
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
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const route = useRoute();
const loading = ref(false);
const selectLoading = ref(false);
const stayId = computed(() => route.params?.id);
const patientId = computed(() => route.params?.patientId);
const doctors = ref<any>([]);
const patients = ref<any>([]);
const rooms = ref<any>([]);
const bedOptions = ref<any[]>([]);

const rules: any = {
  patientId: [{ required: true, message: "", trigger: "change" }],
  dayCount: [{ required: true, message: "", trigger: "change" }],
  roomNumber: [{ required: true, message: "", trigger: "change" }],
  bedId: [{ required: true, message: "", trigger: "change" }],
};

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

const totalPrice = computed(() => {
  const discount = Number(form.discount) || 0;
  return Math.max(0, totalPriceWithoutDiscount.value - discount);
});

const discountPrice = computed(
  () => totalPriceWithoutDiscount.value - totalPrice.value
);

const form = reactive({
  startDate: "",
  endDate: "",
  patientId: patientId.value,
  discount: "",
  roomNumber: null as number | null,
  bedId: null as number | null,
  doctor: null as number | null,
  dayCount: "",
});

const getRooms = async () => {
  try {
    selectLoading.value = true;
    const response = await (<Axios>$axios).post("/api/room/list", {});
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

const getPatientName = () => {
  if (!patients.value || patients.value.length === 0) return "";
  const patient = patients.value[0];
  if (patient?.name) return patient.name;
  if (patient?.firstName && patient?.lastName) {
    return `${patient.firstName} ${patient.lastName}`;
  }
  return "";
};

const getPatientById = async () => {
  // Only fetch if not already loaded from stay response
  if (patients.value.length > 0) return;

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

const getStayById = async () => {
  try {
    loading.value = true;
    const response = await (<Axios>$axios).get(
      `/api/stay/summary/${stayId.value}`
    );
    const data = response?.data?.payload;

    if (data) {
      // Set patient data from response
      if (data.patient) {
        patients.value = [data.patient];
      }

      // Set form fields
      form.startDate = data.startDate || "";
      form.endDate = data.endDate || "";
      form.discount = data.discount || "";
      form.dayCount = data.dayCount || "";
      form.roomNumber = data.room?.id || null;
      form.bedId = data.bed?.id || null;
      form.doctor = data.doctor?.id || null;

      // Load rooms and set selected room with beds
      if (form.roomNumber) {
        await getRooms();

        // If room has beds in response, use them
        if (data.room?.beds && Array.isArray(data.room.beds)) {
          bedOptions.value = data.room.beds.map((bed: any) => {
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
          // Otherwise load beds from room list
          onRoomChange(form.roomNumber);
        }
      }

      // Load doctor if exists
      if (form.doctor && data.doctor) {
        // Add doctor from response to doctors list
        doctors.value = [
          {
            id: data.doctor.id,
            name: data.doctor.name || "",
            ...data.doctor,
          },
        ];
      }
    }
  } catch (error: any) {
    notificationShower(
      "error",
      error?.response?.data?.message || t("ERROR_OCCURRED")
    );
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getRooms();
  getPatientById();
  if (stayId.value) {
    getStayById();
  }
});
</script>

<style scoped lang="scss">
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

:deep(.el-input.is-disabled .el-input__inner),
:deep(.el-input.is-disabled .el-input__wrapper .el-input__inner),
:deep(.el-date-editor.is-disabled .el-input__inner),
:deep(.el-select.is-disabled .el-select__wrapper .el-select__selected-item),
:deep(.el-select.is-disabled .el-select__wrapper .el-select__placeholder),
:deep(
    .el-select.is-disabled .el-select__wrapper .el-select__selected-item span
  ),
:deep(.el-select.is-disabled .el-select__wrapper input) {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
}

:deep(.el-input.is-disabled .el-input__wrapper),
:deep(.el-select.is-disabled .el-select__wrapper),
:deep(.el-date-editor.is-disabled .el-input__wrapper) {
  background-color: white !important;
  cursor: default !important;
}

:deep(.el-select.is-disabled .el-select__wrapper:hover) {
  border-color: #a7aaad !important;
}
</style>
