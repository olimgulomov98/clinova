<template>
  <div>
    <div class="grid-container grid h-[100vh]">
      <div
        class="hidden md:flex flex-col justify-center items-center gap-4 bg-white"
      >
        <h4
          class="overflow-hidden transition-all duration-300 font-semibold text-[22px] leading-[26px] w-full"
        >
          <span class="flex gap-2 items-center cursor-pointer justify-center">
            <!-- <icon-logo-cyrcle class="w-[60px] h-[60px]" /> -->
            <div class="flex flex-col">
              <!-- <icon-logo-text class="w-[90px] h-[40px]" /> -->
              <p class="whitespace-wrap leading-4 text-[22px] text-[#fd4245]">
                CLINOVA
              </p>
              <!-- <p class="whitespace-wrap text-[11px] leading-4 text-[#fd4245]">
                Hospital Management System
              </p> -->
            </div>
          </span>
        </h4>
      </div>
      <div
        class="bg-[#F0FBFF] px-4 sm:px-0 h-full flex flex-col justify-center items-center"
      >
        <h3 class="font-semibold text-[32px] text-blue-dark sm:mb-4">
          {{ t("WELCOME") }}
        </h3>
        <p class="text-[#6B7280] text-base mb-4 ms:mb-8 text-center">
          {{ t("PLEASE_SIGN_IN") }}
        </p>
        <div
          class="p-6 sm:p-8 rounded-2xl box-shadow min-w-full sm:min-w-[400px] bg-white border border-solid border-[#E5F7FF]"
        >
          <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-position="top"
            @keyup.enter="submit"
          >
            <el-form-item :label="t('LOGIN')" prop="phone">
              <v-input
                v-model="form.phone"
                :placeholder="t('ENTER_YOU_LOGIN')"
              />
            </el-form-item>
            <el-form-item :label="t('PASSWORD')" class="pt-2" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                :placeholder="t('ENTER_YOU_PASSWORD')"
                :show-password="true"
              />
            </el-form-item>
            <v-button
              @click="submit"
              :loading="settingsStore.loading"
              type="primary"
              size="xlarge"
              class="w-full !h-12"
            >
              {{ t("ENTER") }}
            </v-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
const { t } = useI18n();
const { userLogin } = useLoginApi();
const settingsStore = useSettingsStore();
const ruleFormRef = ref<HTMLFormElement>();
const { locale, setLocale } = useI18n();
const form = reactive({
  phone: "",
  password: "",
});
const rules = {
  phone: [{ required: true, message: "" }],
  password: [{ required: true, message: "" }],
};

const submit = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    userLogin(form);
  });
};
const setLanguage = (value: string) => {
  setLocale(value);
};
const { $axios } = useNuxtApp();
onMounted(() => {
  setLanguage("ru");
});
</script>

<style scoped lang="css">
:deep(.el-form-item__label) {
  font-weight: 400;
  font-size: 16px !important;
  line-height: 24px;
  color: #757575;
  margin-bottom: 5px !important;
}
.grid-container {
  grid-template-columns: 5fr 7fr;
}
.box-shadow {
  box-shadow: 0px 4px 16px 0px #ef4444;
}
@property --color-gradient-start {
  syntax: "<color>";
  inherits: false;
  initial-value: #fff;
}
@property --color-gradient-end {
  syntax: "<color>";
  inherits: false;
  initial-value: rgba(162, 242, 238, 0.7);
}
.bg-gradient {
  background: linear-gradient(
    90deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  transition: --color-gradient-start 1s, --color-gradient-end 1s;
}
.bg-gradient:hover {
  --color-gradient-start: rgba(162, 242, 238, 0.7);
  --color-gradient-end: #fff;
}
:deep(.el-input__wrapper) {
  background: #f8fdff;
  border: 1px solid #e5f7ff;
  box-shadow: none;
}
@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>
