<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    width="800"
    class="!p-0"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>{{t('ADD_NEW_SCHEDULE')}}</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="p-6">
        <el-form-item :label="t('PATIENT_NAME')" prop="question">
          <v-input v-model="form.value" :placeholder="t('SEARCH_FOR_PATIENT')" />
        </el-form-item>
        <el-form-item :label="t('DEPARTMENT')" prop="question">
          <v-input v-model="form.value" :placeholder="t('SEARCH_FOR_DEPARTMENT')" />
        </el-form-item>
        <el-form-item :label="t('SERVICE_TYPE')" prop="question">
          <v-input v-model="form.value" :placeholder="t('SEARCH_FOR_SERVICE')" />
        </el-form-item>
        <el-form-item :label="t('ASSIGN_DOCTOR')" prop="question">
          <v-input v-model="form.value" :placeholder="t('SEARCH_FOR_DOCTOR')" />
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item :label="t('SCHEDULE_DATE')">
            <v-input v-model="form.value" />
          </el-form-item>
          <el-form-item :label="t('SCHEDULE_TIME')">
            <v-input v-model="form.value" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <el-form-item :label="t('SERVICE_PRICE')" class="!mb-0">
            <v-input v-model="form.value" />
          </el-form-item>
          <el-form-item :label="t('DISCOUNT')" class="!mb-0">
            <v-input v-model="form.value" :placeholder="t('ENTER_DISCOUNT')" />
          </el-form-item>
          <el-form-item :label="t('FINAL_AMOUNT')" class="!mb-0">
            <v-input v-model="form.value" />
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end gap-3 w-full p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">{{t('CANCEL')}}</v-button>
        <v-button type="primary" size="xlarge" native-type="submit" class="!ml-0" :loading="loading">{{t('SAVE')}}</v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
const { t } = useI18n();
const props = defineProps<{ modelValue: boolean; scheduleId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const rules = {
  value: [{ required: true, message: "", trigger: "change" }]
};
const loading = ref(false);
const form = reactive<Partial<any>>({
  value: ""
});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createSchedule();
  });
};
async function createSchedule() {}

const getScheduleById = async () => {};
function update<T extends keyof any>(property: T, value: any[T]) {
  form[property] = value;
}
onMounted(() => {
  if (props.scheduleId) getScheduleById();
});
</script>

<style scoped></style>
