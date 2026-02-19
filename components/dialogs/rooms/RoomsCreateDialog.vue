<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    class="!p-0 !w-full max-w-[600px]"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div
        class="p-4 sm:p-6 flex justify-between border-b border-solid border-gray-line"
      >
        <v-form-title>{{ isEditMode ? t("UPDATE_ROOM") : t("ADD_NEW_ROOM") }}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <div class="p-4 sm:p-6">
        <el-form-item :label="t('ROOM_NUMBER')" prop="number">
          <el-input
            v-model="form.number"
            class="form_input"
            :placeholder="t('ENTER_ROOM_NUMBER')"
          />
        </el-form-item>
        <el-form-item :label="t('PRICE')" prop="price">
          <el-input
            v-model="form.price"
            class="form_input"
            v-mask="'###########################'"
            :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
            :parser="(value: any) => value.replace(/\$\s?|( *)/g, '')"
            :placeholder="t('ENTER_PRICE')"
          />
        </el-form-item>
        <el-form-item :label="t('DEPARTMENT')" prop="departmentId">
          <v-select
            filterable
            class="form_select"
            v-model="form.departmentId"
            :options="departments"
            label-key="name"
            value-key="id"
            remote
            :placeholder="t('SEARCH_AND_SELECT_DEPARTMENT')"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <template #loading>
              <svg class="circular" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" />
              </svg>
            </template>
          </v-select>
        </el-form-item>
        <el-form-item :label="t('BEDS')" prop="beds">
          <el-select
            v-model="form.beds"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            class="form_select w-full"
            :placeholder="t('ENTER_BEDS')"
          >
            <el-option
              v-for="bed in form.beds"
              :key="bed"
              :label="bed"
              :value="bed"
            />
          </el-select>
        </el-form-item>
      </div>

      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <el-button
          type="default"
          class="large_btn large_cancel_btn"
          @click="emit('close')"
          >{{ t("CANCEL") }}</el-button
        >
        <el-button
          type="primary"
          size="large"
          native-type="submit"
          class="!ml-0 large_btn"
          :loading="loading"
        >
          {{ t("SAVE") }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
import { debounce } from "lodash";
import type { IDepartmentListItem } from "~/types/department/index.type";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; room?: any }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const rules = {
  number: [{ required: true, message: "", trigger: "change" }],
  price: [{ required: true, message: "", trigger: "change" }],
  departmentId: [{ required: true, message: "", trigger: "change" }],
  beds: [{ required: true, message: "", trigger: "change" }],
};
const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);
const form = reactive<{
  number: string;
  price: number | undefined;
  departmentId: number | undefined;
  beds: string[];
}>({
  number: "",
  price: undefined,
  departmentId: undefined,
  beds: [],
});
const formRef = ref<FormInstance>();
const isEditMode = computed(() => !!props.room?.id);
const originalBeds = ref<{ id: number; number: string }[]>([]);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    isEditMode.value ? updateRoom() : createRoom();
  });
};
const remoteMethod = debounce((query: string) => {
  const queryData = { searchKey: query };
  if (query.length > 1) getDepartments(queryData);
}, 300);
const getDepartments = (queryData?: { searchKey: string }) => {
  loading.value = true;
  (<Axios>$axios)
    .post("/api/department/list", { ...queryData, showAll: true })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
};
async function createRoom() {
  loading.value = true;
  (<Axios>$axios)
    .post("/api/room/create", {
      number: form.number,
      departmentId: form.departmentId,
      price: Number(form.price),
      beds: form.beds,
    })
    .then((res) => {
      notificationShower("success", t("ROOM_CREATED_SUCCESS"));
      emit("close");
      emit("getData");
      resetForm();
    })
    .catch((error) => {
      console.error("Error creating room:", error);
      notificationShower(
        "error",
        error?.response?.data?.message || t("ERROR_OCCURRED")
      );
    })
    .finally(() => {
      loading.value = false;
    });
}

async function updateRoom() {
  const roomId = props.room?.id;
  if (!roomId) return;

  const currentNumbers = new Set(form.beds.map(String));
  const deletedBeds = originalBeds.value
    .filter((b) => !currentNumbers.has(String(b.number)))
    .map((b) => b.id);
  const beds = form.beds.map((num) => {
    const orig = originalBeds.value.find((b) => String(b.number) === String(num));
    return { id: orig?.id ?? 0, number: String(num) };
  });

  loading.value = true;
  (<Axios>$axios)
    .put("/api/room/update", {
      id: roomId,
      number: form.number,
      departmentId: form.departmentId,
      price: Number(form.price),
      beds,
      deletedBeds,
    })
    .then((res) => {
      notificationShower("success", t("ROOM_UPDATE_SUCCESS"));
      emit("close");
      emit("getData");
      resetForm();
    })
    .catch((error) => {
      console.error("Error updating room:", error);
      notificationShower(
        "error",
        error?.response?.data?.message || t("ERROR_OCCURRED")
      );
    })
    .finally(() => {
      loading.value = false;
    });
}
const resetForm = () => {
  form.number = "";
  form.price = undefined;
  form.departmentId = undefined;
  form.beds = [];
  originalBeds.value = [];
};

const prefillForm = () => {
  const r = props.room;
  if (!r?.id) return;
  form.number = r.number ?? "";
  form.price = r.price ?? undefined;
  form.departmentId = r.department?.id ?? r.departmentId ?? undefined;
  const bedList = Array.isArray(r.beds)
    ? r.beds.map((b: any) => ({ id: b?.id ?? 0, number: String(b?.number ?? b?.id ?? b ?? "") })).filter((b: { number: string }) => b.number)
    : [];
  originalBeds.value = bedList;
  form.beds = bedList.map((b: { id: number; number: string }) => b.number);
};

watch(
  () => [props.modelValue, props.room],
  ([visible, room]) => {
    if (!visible) resetForm();
    else if (room?.id) prefillForm();
    else resetForm();
  },
  { immediate: true }
);

onMounted(() => {
  getDepartments();
});
</script>

<style scoped></style>
