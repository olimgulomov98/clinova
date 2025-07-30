<template>
  <PatientLayout>
    <div class="page-container">
      <!-- <div class="flex justify-between flex-wrap items-center">
        <div class="page-title">Patients</div>
      </div> -->
      <VTable
        :filters="filters"
        :table-data="tableData?.list"
        :loading="isLoading"
        @sort-change="sortChange"
        @search="search"
        search-class="filter-search filter-search_light"
        search-left-position
      >
        <template #filter>
          <el-button
            type="primary"
            class="small_btn"
            @click="isPatientCreateVisible = true"
            v-if="hasPermission('patient', 'add_delete_patient')"
          >
            <icon-plus />
            {{ t("ADD_PATIENT") }}
          </el-button>
        </template>
        <!-- <template #tabs>
          <el-form-item prop="statusId" class="!mb-0">
            <v-select
              class="filter_select"
              filterable
              v-model="filters.status"
              :options="statusOptions"
              label-key="name"
              value-key="id"
              :placeholder="t('STATUS')"
              clearable
              style="width: 100px"
              :is-filter="true"
            />
          </el-form-item>
        </template> -->
        <template #columns>
          <el-table-column prop="action" :label="t('ACTION')">
            <template #default="{ row }">
              <el-dropdown>
                <button class="p-3">
                  <icon-dots />
                </button>
                <template #dropdown>
                  <el-dropdown-menu class="!p-0">
                    <el-dropdown-item @click="showHandle(row)">
                      <button
                        class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                      >
                        {{ t("EDIT") }}
                      </button>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="hasPermission('patient', 'add_delete_patient')"
                    >
                      <button
                        @click="deleteAction(row.id)"
                        class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                      >
                        {{ t("DELETE") }}
                      </button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column :label="t('CODE')">
            <template #default="{ row }">
              <div @click="showHandle(row)" class="link-div">
                {{ row.code }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="t('NAME')" />
          <el-table-column prop="age" :label="t('AGE')" />
          <el-table-column prop="address" :label="t('ADDRESS')" />
          <el-table-column prop="occupation" :label="t('OCCUPATION')" />
          <el-table-column
            prop="lastVisit"
            :label="t('LAST_VISIT_DATE')"
            :formatter="(row) => getFormatDate(row.lastVisit)"
          />
          <!-- <el-table-column prop="status" :label="t('STATUS')">
            <template #default="{ row }">
              <div v-if="row.status">
                <el-tag :type="getStatusTheme(row.status)" effect="light" round>
                  {{ t(row.status) }}
                </el-tag>
              </div>
            </template>
          </el-table-column> -->
        </template>
      </VTable>
      <VPagination
        v-model="filters"
        total-page-hide
        :total-page="tableData?.total"
        @update-query="updateQuery"
      />
      <PatientCreateDialog
        v-if="isPatientCreateVisible"
        v-model="isPatientCreateVisible"
        @close="isPatientCreateVisible = false"
        @getData="getData"
        :patient-id="patient?.id"
      />
      <PatientShowDialog
        v-if="isPatientShowVisible"
        v-model="isPatientShowVisible"
        @close="isPatientShowVisible = false"
        :patient-id="patient?.id"
      />
    </div>
  </PatientLayout>
</template>

<script setup lang="ts">
import type { Axios } from "axios";
import { getFormatDate } from "~/utils";
const { t } = useI18n();
const { $axios } = useNuxtApp();
const tabStore = useUrlTabStore();
const isPatientShowVisible = ref(false);
const isPatientCreateVisible = ref(false);
const patient = ref();
const isLoading = ref(false);
const router = useRouter();
const { hasPermission } = usePermission();
const filters = ref({
  searchKey: null,
  departmentId: null,
  orderBy: null,
  desc: null,
  startDate: null,
  endDate: null,
  page: 1,
  size: 10,
  status: null,
});

const statusOptions = [
  {
    id: "NEW",
    name: t("NEW"),
  },
  {
    id: "FOLLOW_UP",
    name: t("FOLLOW_UP"),
  },
  {
    id: "TEMPORARY",
    name: t("TEMPORARY"),
  },
];

const tableData = ref([]);
const { updateQuery, clearQuery } = useQuerySync(filters.value);

const getData = async () => {
  isLoading.value = true;
  try {
    const { page, page_size, ...restFilters } = filters.value;
    const payload = {
      ...restFilters,
      page: page - 1,
      size: page_size || filters.value.size,
    };

    const response = await (<Axios>$axios).post("/api/patient/list", payload);
    const data = response?.data?.payload;

    if (data) {
      tableData.value = data;
    } else {
      console.warn("No payload found in response:", response);
    }
  } catch (error: any) {
    console.error("Failed to fetch data:", error?.message || error);
  } finally {
    isLoading.value = false;
  }
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "NEW":
      return "success";
    case "FOLLOW_UP":
      return "info";
    case "TEMPORARY":
      return "warning";
  }
};

const sortChange = (field: string, desc: boolean | null) => {
  filters.value.orderBy = field;
  filters.value.desc = desc;
};

const search = (value: string) => {
  filters.value.searchKey = value;
};
const editHandle = (argPatient: any) => {
  useSetUrl({ name: "P", url: `/patients/${argPatient.id}` });
  router.push(`/patients/${argPatient.id}`);
  // isPatientCreateVisible.value = true;
  // patient.value = argPatient;
};
const showHandle = (argPatient: any) => {
  const url = tabStore.urls.find((item: any) => item.name == argPatient.code);
  if (url) {
    router.push(url.url);
  } else {
    useSetUrl({
      name: argPatient.code,
      url: `/patients/${argPatient.id}?tab=profile`,
    });
    router.push(`/patients/${argPatient.id}?tab=profile`);
  }
};
const deleteAction = (id: number) => {
  (<Axios>$axios).delete(`/api/patient/${id}`).then((res) => {
    notificationShower("success", t("PATIENT_DELETED_SUCCESS"));
    getData();
  });
};

// hooks

watch(filters.value, () => {
  getData();
});
watch(
  () => isPatientCreateVisible.value,
  (val) => {
    if (!val) patient.value = undefined;
  }
);
watch(
  () => isPatientShowVisible.value,
  (val) => {
    if (!val) patient.value = undefined;
  }
);
onMounted(() => {
  getData();
});
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
