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
        <v-form-title>{{
          departmentId ? t("UPDATE_DEPARTMENT") : t("ADD_NEW_DEPARTMENT")
        }}</v-form-title>
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
        <el-form-item :label="t('PARENT_DEPARTMENT')" prop="parentId">
          <el-select
            v-model="form.parentId"
            class="form_input"
            filterable
            clearable
            remote
            allow-create
            default-first-option
            reserve-keyword
            :loading="selectLoading"
            :remote-method="(query: any) => getDepartments({ searchKey: query
            })"
            :placeholder="t('SELECT_PARENT_DEPARTMENT')"
          >
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('DEPARTMENT_NAME')" prop="name">
          <el-input
            v-model="form.name"
            class="form_input"
            :placeholder="t('ENTER_DEPARTMENT_NAME')"
          />
        </el-form-item>
        <el-form-item
          :label="t('DEPARTMENT_ABOUT')"
          prop="description"
          class="!mb-0"
        >
          <el-input
            v-model="form.description"
            class="form_input"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </div>

      <div
        class="flex justify-end gap-3 w-full p-4 sm:p-6 border-t border-solid border-gray-line"
      >
        <el-button
          type="default"
          class="large_btn large_cancel_btn"
          @click="emit('close')"
          >{{ t("CLOSE") }}</el-button
        >
        <el-button
          type="primary"
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
import type { Axios, AxiosInstance } from "axios";
import type { FormInstance } from "element-plus";
import type {
  IDepartmentCreate,
  IDepartmentListItem,
} from "~/types/department/index.type";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; departmentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const rules = {
  name: [{ required: true, message: "", trigger: "change" }],
  description: [{ required: true, message: "", trigger: "change" }],
};

const loading = ref(false);
const form = reactive<Partial<IDepartmentCreate>>({
  parentId: undefined,
  name: "",
  description: "",
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createDepartment();
  });
};
async function createDepartment() {
  loading.value = true;
  const id = props.departmentId;
  const url = id ? `/api/department/update` : "/api/department/create";
  const method = id ? "put" : "post";
  (<Axios>$axios)
    [method](url, { ...form, id })
    .then((res) => {
      notificationShower(
        "success",
        id ? t("DEPARTMENT_UPDATE_SUCCESS") : t("DEPARTMENT_CREATED_SUCCESS")
      );
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}

const departments = ref<IDepartmentListItem[]>([]);
const selectLoading = ref(false);

const getDepartments = (queryData?: { searchKey?: string }) => {
  selectLoading.value = true;
  (<AxiosInstance>$axios)
    .post("/api/department/list", { ...queryData, showAll: true, size: 500 })
    .then((res: IBaseResponseModel<IDepartmentListItem[]>) => {
      departments.value = res?.data?.payload?.list || [];
    })
    .finally(() => {
      selectLoading.value = false;
    });
};

const getDepartmentById = async () => {
  (<Axios>$axios)
    .get(`/api/department/summary/${props.departmentId}`)
    .then((res) => {
      form.name = res.data.payload.name;
      form.description = res.data.payload.description;
      form.parentId = res.data.payload.parent.id;
    });
};

onMounted(() => {
  getDepartments();
  if (props.departmentId) getDepartmentById();
});
</script>

<style scoped></style>
