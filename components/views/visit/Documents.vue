<template>
  <div class="page-container mt-5">
    <VTable
      :table-data="tableDataBySearch"
      :loading="isLoading"
      :search-placeholder="t('SEARCH')"
      search-left-position
      @search="search"
    >
      <template #columns>
        <el-table-column prop="action" :label="t('ACTION')">
          <template #default="{ row }">
            <el-dropdown>
              <button class="p-3">
                <icon-dots />
              </button>
              <template #dropdown>
                <el-dropdown-menu class="!p-0">
                  <el-dropdown-item
                    @click="
                      downloadFile(
                        `https://${row?.attachmentLink}`,
                        row?.originalName
                      )
                    "
                  >
                    <button
                      class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                    >
                      {{ t("DOWNLOAD") }}
                    </button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="originalName" :label="t('FILE_NAME')" />
        <el-table-column prop="description" :label="t('FILE_DESCRIPTION')" />
        <el-table-column
          prop="creationDate"
          :label="t('UPLOAD_DATE')"
          :formatter="(row) => getFormatDate(row?.creationDate)"
        />
        <el-table-column prop="createdBy" :label="t('UPLOADED_BY')" />
        <el-table-column prop="visit" :label="t('VISIT_NUMBER')" />
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatDate } from "~/utils";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const isLoading = ref(false);
const loading = ref(false);
const route = useRoute();

const filters = ref<any>({
  searchKey: null,
});

const tableData = ref<any>([]);

const getData = async () => {
  isLoading.value = true;
  try {
    const response = await (<Axios>$axios).get(
      `/api/attachment/patient/${route.params.patientId}`
    );
    const data = response?.data?.payload;

    if (data) {
      tableData.value = data;
    } else {
      console.warn("No payload found in response:", response);
    }

    console.log(`Fayl:`, data);
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    isLoading.value = false;
  }
};

async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename || "file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Download xatoligi:", err);
  }
}

const search = (value: string) => {
  filters.value.searchKey = value;
};

// hooks

const tableDataBySearch = computed(() => {
  const searchKey = filters.value.searchKey?.toLowerCase()?.trim();
  if (!searchKey) return tableData.value;

  return tableData.value?.filter((item) => {
    return [
      item.attachmentLink,
      item.originalName,
      item.description,
      item.createdBy,
      item.visit,
    ].some((field) => field?.toLowerCase()?.includes(searchKey));
  });
});

onMounted(() => {
  getData();
});

function formatBytes(arg0: number) {
  throw new Error("Function not implemented.");
}
</script>

<style scoped lang="scss">
.box-page {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  grid-gap: 20px;
  align-items: end;
}
</style>
