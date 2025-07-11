<template>
  <div class="relative">
    <el-button class="follow-up-create-button absolute right-0 top-10" @click="isFollowUpCreateDialogVisible = true">
      <span class="flex gap-1 text-blue-dark items-center">
        <icon-plus class="text-blue-dark" />
        {{ t("FOLLOW_UP") }}
      </span>
    </el-button>
    <el-form
      ref="formRef"
      label-position="top"
      :key="tableIndex"
      :model="{ form }"
      :rules="rules"
      @submit.prevent="submitForm(formRef)"
    >
      <div class="p-4 sm:p-6" v-for="(item, index) in form" :key="index">
        <el-form-item :prop="`form.${index}.type`" :label="t('CHOOSE_ONE')" class="max-w-[340px]">
          <el-select v-model="item.type" @change="typeChange" class="custom_select">
            <el-option
              v-for="typeValue in diagnosis_types"
              :key="typeValue.id"
              :value="typeValue.id"
              :label="typeValue.name"
              :disabled="selectedTypes.includes(typeValue.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :prop="`form.${index}.text`" v-if="item.type" class="!mb-0">
          <v-input v-model="item.text" type="textarea" :rows="4" />
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end">
      <button @click="submitForm(formRef)" :class="{ 'pointer-events-none': loading }" :disabled="form.length < 2">
        <el-button
          type="primary"
          class="small_btn"
          :loading="loading"
          :class="{ 'pointer-events-none opacity-50': form.length < 2 }"
        >
          Save
        </el-button>
      </button>
    </div>
    <FollowUsCreateDialog v-model="isFollowUpCreateDialogVisible" @close="isFollowUpCreateDialogVisible = false" />
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import type { FormInstance } from "element-plus";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const router = useRouter();
const diagnosis_types = computed(() => useConstants().DIAGNOSIS_TYPES.map((item) => ({ name: t(item), id: item })));
const tabStore = useUrlTabStore();
const selectedTypes = computed(() => form.value.map((item) => item.type));
const isFollowUpCreateDialogVisible = ref(false);
const isMounted = ref(false);
const tableIndex = ref(0);
const formRef = ref();
const route = useRoute();
const diagnosis = ref<any[]>([]);
const loading = ref(false);
const rules = computed(() => {
  const result: Record<string, any> = {};
  form.value.forEach((item, index) => {
    result[`form.${index}.text`] = [
      {
        required: !!item.type,
        message: t("TEXT_REQUIRED_IS_SELECT"),
        trigger: "focus",
      },
    ];
  });
  return result;
});
const form = ref<any[]>([
  {
    type: "",
    text: "",
    visitId: Number(route.params?.id) || undefined,
  },
]);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createDiagnosis();
  });
};
async function createDiagnosis() {
  loading.value = true;
  const data = form.value.filter((item) => item.type);
  const url = "/api/diagnosis/bulk-create";
  const method = "post";
  (<Axios>$axios)
    [method](url, data)
    .then((res) => {
      notificationShower("success", t("DATA_SAVE_SUCCESS"));
      tabStore.removeUrl(route.fullPath);
      router.push(`/patients/${route.params?.patientId}?tab=history`);
    })
    .finally(() => {
      loading.value = false;
    });
}
const typeChange = () => {
  const valid = diagnosis_types.value.length !== selectedTypes.value.length;
  if (form.value.at(-1).type !== "" && valid)
    form.value.push({
      type: "",
      text: "",
      visitId: Number(route.params?.id) || undefined,
    });
};
const getData = async () => {
  (<Axios>$axios)
    .post("/api/diagnosis/list", { visitId: Number(route.params?.id), patientId: Number(route.params?.patientId) })
    .then((res) => {
      diagnosis.value = res.data?.payload?.list || [];
      if(diagnosis.value.length > 0)
      form.value = diagnosis.value.map((item: any) => {
        return {
          type: item?.type,
          text: item?.text,
          visitId: Number(route.params?.id) || undefined,
        };
      });
      tableIndex.value++;
      typeChange();
    });
};

onMounted(() => {
  isMounted.value = true;
  if (tabStore.getData(route.fullPath)) form.value = tabStore.getData(route.fullPath);
  getData();
  tableIndex.value++;
});
onUnmounted(() => {
  tabStore.updateData(route.fullPath, form);
});
</script>

<style lang="css">
.follow-up-create-button {
  border-radius: 8px !important;
  border: 1px solid var(--color-blue-dark) !important;
}
.custom_select .el-select__wrapper {
  background-color: #f0f0f0;
  color: #05080b;
  height: 45px;
}
.custom_select .el-select__wrapper .el-select__placeholder {
  color: #05080b;
}
</style>
