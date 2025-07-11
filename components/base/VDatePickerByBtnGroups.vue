<template>
  <div class="calendar-btn">
    <el-dropdown @visible-change="(val) => isDropdownOpen = val" class="min-w-[70px]" >
      <div
          class="flex items-center gap-x-2 outline-none w-full justify-between"
      >
        <icon-calendar-blank/>

          <div class="text-[12px]">
            {{ t(tabIndex) }}
          </div>
        <icon-nav-caret-down   :class="['transition-transform duration-300', isDropdownOpen ? 'rotate-180' : 'rotate-0']"/>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="!p-0 w-50 min-w-[70px] ">
          <el-dropdown-item
              v-for="(tab, index) in tabs.filter(item => item.code !== tabIndex)"
              :key="index"
              @click="onChangeTabStatus(tab.code)"
          >
            <div class="text-[12px]  font-medium">
              {{ t(tab.code) }}
            </div>
          </el-dropdown-item>

        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
const emit = defineEmits(["onChangeDatePicker"]);
const isDropdownOpen = ref(false)
const { t } = useI18n();
const tabIndex=ref('ALL')


const tabs = ref([
  {
    label: t("TODAY"),
    code: 'TODAY',
    value: [dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'), dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]')]
  },
  {
    label: t('WEEK'),
    code: 'WEEK',
    value: [dayjs().startOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'), dayjs().endOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]')]
  },
  {
    label: t("MONTH"),
    code: 'MONTH',
    value: [dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss[Z]'), dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss[Z]')]
  },
  {
    label: t("ALL"),
    code: 'ALL',
    value: null
  }
])

const onChangeTabStatus = (labels:string) => {
  tabIndex.value = labels
  emit('onChangeDatePicker', tabs.value.find(i=>i.code === labels).value)
}
onMounted(() => {
  const allTab = tabs.value.find(tab => tab.code === 'ALL')
  if (allTab) {
    tabIndex.value = allTab.code
  }
})
</script>

<style lang="scss">
.calendar-btn{
  background: #EAF2F8;
  display: flex;
  padding: 0 10px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  height: 30px;
  font-family: "SourceSans3", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #757D83;
  cursor: pointer;
  outline: none;
}
</style>