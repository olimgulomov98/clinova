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
          serviceId ? t("UPDATE_SERVICE") : t("ADD_NEW_SERVICE")
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
        <el-form-item :label="t('SERVICE_NAME')" prop="name">
          <el-input
            v-model="form.name"
            class="form_input"
            :placeholder="t('ENTER_SERVICE_NAME')"
          />
        </el-form-item>
        <el-form-item :label="t('PRICE')" prop="price">
          <el-input
            v-model="form.price"
            class="form_input"
            v-mask="'###########################'"
            :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
            :parser="(value: any) => value.replace(/\$\s?|( *)/g, '')"
            placeholder="0.00"
          />
        </el-form-item>
        <el-form-item
          :label="t('DEPARTMENT')"
          prop="departmentId"
          class="!mb-0"
        >
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
          size="xlarge"
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
import type { IServiceCreate } from "~/types/service/index.type";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; serviceId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const { $axios } = useNuxtApp();
const rules = {
  name: [{ required: true, message: "", trigger: "change" }],
  price: [{ required: true, message: "", trigger: "change" }],
  departmentId: [{ required: true, message: "", trigger: "change" }],
};
const departments = ref<IDepartmentListItem[]>([]);
const loading = ref(false);
const form = reactive<Partial<IServiceCreate>>({
  name: "",
  price: undefined,
  departmentId: undefined,
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createService();
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
async function createService() {
  loading.value = true;
  const id = props.serviceId;
  const url = id ? `/api/service/update` : "/api/service/create";
  const method = id ? "put" : "post";
  (<Axios>$axios)
    [method](url, { ...form, price: Number(form.price), id })
    .then((res) => {
      notificationShower(
        "success",
        id ? t("SERVICE_UPDATE_SUCCESS") : t("SERVICE_CREATED_SUCCESS")
      );
      emit("close");
      emit("getData");
    })
    .finally(() => {
      loading.value = false;
    });
}
const getServiceById = async () => {
  (<Axios>$axios).get(`/api/service/summary/${props.serviceId}`).then((res) => {
    form.name = res.data.payload.name;
    form.departmentId = res.data.payload.department?.id;
    form.price = res.data.payload.price;
    if (
      !departments.value.find(
        (department) => department.id === form.departmentId
      )
    ) {
      departments.value.push(res.data.payload.department);
    }
  });
};
onMounted(() => {
  getDepartments();
  if (props.serviceId) getServiceById();
});
</script>

<style scoped></style>
