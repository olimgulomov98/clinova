<template>
  <el-dialog
    :destroy-on-close="true"
    :show-close="false"
    :model-value="modelValue"
    width="600"
    class="!p-0"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('close')"
  >
    <template #header>
      <div class="p-6 flex justify-between border-b border-solid border-gray-line">
        <v-form-title>Add Payment</v-form-title>
        <button @click="emit('close')"><icon-x /></button>
      </div>
    </template>
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="submitForm(formRef)">
      <div class="p-6 flex flex-col gap-6" v-auto-animate>
        <el-form-item label="Select Patient Visit" prop="question" class="!mb-0">
          <v-select
            :group="true"
            :options="options"
            v-model="form.value"
            placeholder="Search by patient name"
          />
        </el-form-item>
        <div class="flex flex-col gap-6" v-if="form.value">
          <div class="bg-gray-subtle p-4 rounded-lg flex flex-col gap-4">
            <div class="flex justify-between">
              <h6 class="font-semibold text-base">John Smith</h6>
              <p class="text-sm text-gray-20">Visit V-001 - 2024-01-15</p>
            </div>
            <div class="flex flex-col gap-3">
              <div v-for="i in 2" class="flex justify-between items-center p-3 rounded-lg bg-white pl-[60px]">
                <div>
                  <p class="text-base font-medium">General Checkup</p>
                  <span class="text-sm text-gray-20">500,000 so'm</span>
                </div>
                <div>
                  <v-input v-model="form.value" />
                  <span class="text-base">%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-subtle rounded-lg p-4 grid grid-cols-3 gap-4 px-10">
            <div>
              <p class="text-sm text-green-30">Total Amount</p>
              <h5 class="font-semibold text-lg">750,000 so'm</h5>
            </div>
            <div>
              <p class="text-sm text-green-30">Discount Amount</p>
              <h5 class="font-semibold text-lg text-[#FF4D4F]">0 so'm</h5>
            </div>
            <div>
              <p class="text-sm text-green-30">Final Amount</p>
              <h5 class="font-semibold text-lg">750,000 so'm</h5>
            </div>
          </div>
          <div class="bg-gray-subtle p-4 rounded-lg flex flex-col gap-3">
            <p class="text-base font-semibold">Payment Method</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <p class="text-sm font-semibold text-gray-30">Card Amount</p>
                <v-input :model-value="'0 so\'m'" type="text" class="white-input" />
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-semibold text-gray-30">Card Amount</p>
                <v-input :model-value="'0 so\'m'" type="text" class="white-input" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3 w-full p-6 border-t border-solid border-gray-line">
        <v-button type="default" size="xlarge" @click="emit('close')">Cancel</v-button>
        <v-button type="primary" size="xlarge" native-type="submit" class="!ml-0" :loading="loading">
          Complete Payment
        </v-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
const props = defineProps<{ modelValue: boolean; paymentId?: number }>();
const emit = defineEmits(["update:modelValue", "getData", "close"]);
const rules = {
  value: [{ required: true, message: "", trigger: "change" }]
};
const loading = ref(false);
const form = reactive<Partial<any>>({
  value: ""
});
const displayLabel = computed(() => {
  if (!form.value) return "";
  return `${form.value.value} - ${form.value.label}`;
});
const options = [
  {
    label: "Sarah Johnson",
    options: [
      {
        value: "Visit V-001",
        label: "Visit V-001"
      },
      {
        value: "Visit V-002",
        label: "Visit V-002"
      }
    ]
  },
  {
    label: "Jhon Conor",
    options: [
      {
        value: "Visit V-001",
        label: "Visit V-001"
      },
      {
        value: "Visit V-002",
        label: "Visit V-002"
      },
      {
        value: "Visit V-003",
        label: "Visit V-003"
      }
    ]
  }
];
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    createPayment();
  });
};
async function createPayment() {}

const getPaymentById = async () => {};
function update<T extends keyof any>(property: T, value: any[T]) {
  form[property] = value;
}
onMounted(() => {
  if (props.paymentId) getPaymentById();
});
</script>

<style scoped>
.white-input :deep(.el-input__wrapper) {
  background: white;
}
</style>
