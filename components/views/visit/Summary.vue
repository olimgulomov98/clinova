<template>
  <div class="page-container">
  <div v-if="isMounted" class="demo-collapse-position">
    <el-form ref="formRef" label-position="top">
      <div class="grid sm:grid-cols-4 sm:gap-4">
        <el-form-item :label="t('VISIT_DATE')" prop="time">
          <v-date-picker :model-value="visits?.startDate" format="DD.MM.YYYY" readonly/>
        </el-form-item>
        <el-form-item :label="t('VISIT_NUMBER')" prop="patientName">
          <v-input :model-value="visits?.code" :readonly="true"/>
        </el-form-item>
      </div>
    </el-form>
    <el-collapse :expand-icon-position="'left'">
      <el-collapse-item
        v-for="(collapse, index) in diagnosis?.filter(item=>item.type =='COMPLAINT')"
        :title="t(collapse?.type)"
        :name="index+222"
      >
        <div class="bg-[#F0F0F0] p-4 rounded-[8px] text-[14px] text-[#757575]">
          {{ collapse?.text }}
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-for="(collapse, index) in diagnosis?.filter(item=>item.type ==='PRIMARY')"
        :title="t(collapse?.type)"
        :name="index+45"
      >
        <div class="bg-[#F0F0F0] p-4 rounded-[8px] text-[14px] text-[#757575]">
          {{ collapse?.text }}
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-for="(collapse, index) in diagnosis?.filter(item=>item.type ==='MIDDLE')"
        :title="t(collapse?.type)"
        :name="index+3"
      >
        <div class="bg-[#F0F0F0] p-4 rounded-[8px] text-[14px] text-[#757575]">
          {{ collapse?.text }}
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-for="(collapse, index) in diagnosis?.filter(item=>item.type ==='FINAL')"
        :title="t(collapse?.type)"
        :name="index+102"
      >
        <div class="bg-[#F0F0F0] p-4 rounded-[8px] text-[14px] text-[#757575]">
          {{ collapse?.text }}
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-for="(collapse, index) in diagnosis?.filter(item=>item.type ==='PRESCRIPTION')"
        :title="t(collapse?.type)"
        :name="index+101"
      >
        <div class="bg-[#F0F0F0] p-4 rounded-[8px] text-[14px] text-[#757575]">
          {{ collapse?.text }}
        </div>
      </el-collapse-item>
      <el-collapse-item
          v-if="visits?.items?.length>0"
          :title="t('SERVICES_PROVIDED')"
          name="index1"
      >
        <div >
          <SummaryServiceTable :visits="visits"/>
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="visits?.images?.length>0"
        :title="t('ATTACHMENT')"
        name="index-download2"
      >
        <div>
          <VTable
            :table-data="visits?.images"
            with-out-search
          >
            <template #columns>
              <el-table-column prop="action" label="Action">
                <template #default="{ row }">
                  <el-dropdown>
                    <button class="p-3">
                      <icon-dots/>
                    </button>
                    <template #dropdown>
                      <el-dropdown-menu class="!p-0">
                        <el-dropdown-item @click="downloadFile(row?.attachmentLink, row?.originalName)">
                          <button
                            class="text-base flex gap-2 items-center font-medium text-gray-400 pb-0 justify-between w-full"
                          >
                            {{ t('DOWNLOAD') }}
                          </button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column prop="originalName" :label="t('FILE_NAME')"/>
              <el-table-column prop="description" :label="t('FILE_DESCRIPTION')"/>
              <el-table-column prop="creationDate" :label="t('UPLOAD_DATE')"
                               :formatter="(row) => getFormatDate(row?.creationDate)"/>
              <el-table-column prop="createdBy" :label="t('UPLOADED_BY')"/>
            </template>
          </VTable>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="flex justify-end ">
    <el-button class="small_btn" @click="downloadPrintInvoice">{{t('PRINT_VISIT')}}</el-button>
  </div>
  </div>
</template>


<script setup lang="ts">
import type {Axios} from "axios";
import {getFormatDate} from "~/utils";
import SummaryServiceTable from "~/components/views/visit/SummaryServiceTable.vue";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const isMounted = ref(false);
const route = useRoute();
const diagnosis = ref<any[]>([]);
const visits = ref<any[]>();


const getDataDiagnosisDetail = async () => {
  (<Axios>$axios)
    .post("/api/diagnosis/list", {visitId: Number(route.params?.id), patientId: Number(route.params?.patientId)})
    .then((res) => {
      diagnosis.value = res.data?.payload?.list || [];
    });
};

const getDataVisitDetail = async () => {
  (<Axios>$axios)
    .get(`/api/visit/summary/${Number(route.params?.id)}`)
    .then((res) => {
      visits.value = res.data?.payload || [];
    });
};

function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  getDataDiagnosisDetail();
  getDataVisitDetail()
  isMounted.value = true;
});

const downloadPrintInvoice = async () => {
  try {
    const response = await (<Axios>$axios).get(`/api/pdf/visit/${visits.value?.id}`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = visits.value?.code || 'invoice.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the object URL
  } catch (error) {
    console.error('Failed to download invoice:', error);
  }
};
</script>

<style lang="scss" >

.el-collapse-item__header {
  border-bottom: none !important;
  border-top: none !important;
}

.el-collapse {
  border-bottom: none !important;
  border-top: none !important;
}

.el-collapse-item {
  border-bottom: none !important;
  border-top: none !important;
}

.el-collapse-item__wrap {
  border-bottom: none !important;
  border-top: none !important;
}

.demo-collapse-position {
  .el-collapse {
    .el-collapse-item {
      border: none !important;

      button {
        color: #233955;
        font-family: "SourceSans3", sans-serif;
        font-size: 18px;
      }

    }
  }
}
</style>
