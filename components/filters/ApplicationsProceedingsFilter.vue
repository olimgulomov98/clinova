<template>
  <div class="flex gap-[10px] md:flex-row flex-col">
    <div class="flex gap-[10px] flex-wrap w-full">
      <el-input v-model="filterValue.name" placeholder="FISH" class="sm:max-w-[180px]" />
      <el-input v-model="filterValue.pin" placeholder="JSHSHIR" class="sm:max-w-[180px]" />
      <el-select v-model="filterValue.option" class="sm:max-w-[180px]" placeholder="Hudud">
        <el-option v-for="(option, index) in options" :key="index" :value="option.value" :label="option.label" />
      </el-select>
      <el-select v-model="filterValue.option" class="sm:max-w-[180px]" placeholder="TUMAN/SHAHAR">
        <el-option v-for="(option, index) in options" :key="index" :value="option.value" :label="option.label" />
      </el-select>
      <el-select v-model="filterValue.option" class="sm:max-w-[180px]" placeholder="MAHALLA">
        <el-option v-for="(option, index) in options" :key="index" :value="option.value" :label="option.label" />
      </el-select>
      <el-select v-model="filterValue.option" class="sm:max-w-[180px]" placeholder="HOLATI">
        <el-option v-for="(option, index) in options" :key="index" :value="option.value" :label="option.label" />
      </el-select>
      <el-select v-model="filterValue.option" class="sm:max-w-[115px]" placeholder="JINSI">
        <el-option v-for="(option, index) in options" :key="index" :value="option.value" :label="option.label" />
      </el-select>

      <el-date-picker
        v-model="filterValue.birthday"
        value-format="DD.MM.YYYY"
        format="DD.MM.YYYY"
        placeholder="VAQTI"
        class="sm:max-w-[160px]"
      />
    </div>
    <div class="flex gap-[10px]">
      <v-button type="default" @click="emit('updateQuery')" />
      <v-button type="default" @click="emit('clearQuery')" />
    </div>
  </div>
</template>
<script setup lang="ts">

defineProps<{ modelValue: object }>();
const emit = defineEmits(["updateQuery", "clearQuery"]);
const filterValue = defineModel<any>({
  default: () => ({})
});

const options = [
  {
    value: 1,
    label: "Option 1"
  },
  {
    value: 2,
    label: "Option 2"
  },
  {
    value: 3,
    label: "Option 3"
  }
];
</script>
