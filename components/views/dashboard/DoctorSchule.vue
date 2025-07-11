<template>
  <VBlockCard>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <VBlockTitle>Doctors’ Schedule</VBlockTitle>
      </div>
      <button>
        <icon-dots-three class="h-[30px] w-[30px]" />
      </button>
    </div>
    <div class="flex flex-col gap-[14px]">
      <div v-for="(i, index) in 6" class="flex justify-between items-center " :class="{'border-b border-solid border-gray-line pb-[14px]': index + 1 !== 6}">
        <div class="flex gap-3">
          <div class="h-[30px] w-[30px] rounded-full overflow-hidden">
            <img class="w-full h-full object-cover" src="../../../assets/icons/logo.svg" alt="" />
          </div>
          <div class="flex flex-col">
            <p class="text-black text-[12px]">Dr. Petra Winsburry</p>
            <p class="text-gray-20 text-[10px]">General Medicine</p>
          </div>
        </div>
        <div class="flex flex-col justify-center items-end gap-[6px]">
          <VAvailableStatus :status="index % 2 === 0" />
          <p class="text-gray-20 text-[10px]">09:00 AM - 12:00 PM</p>
        </div>
      </div>
    </div>
  </VBlockCard>
</template>

<script setup lang="ts"></script>

<style scoped></style>
