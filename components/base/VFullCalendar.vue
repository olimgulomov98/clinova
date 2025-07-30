<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import enLocale from "@fullcalendar/core/locales/en-gb";
import ruLocale from "@fullcalendar/core/locales/ru";
import uzLocale from "@/locales/fullcalendar-uz";

import type { ICalendarEvent } from "@/types/time-grid-calendar.type";
import type { IAppointmentCreate } from "@/types/appointment/index.type";
import type { AxiosInstance } from "axios";

import { useUserStore } from "@/store/auth.store";

const userStore = useUserStore();
const roles = userStore.userRoles;
const canEditCalendar = computed(() => !roles.includes("DOCTOR"));

const props = defineProps<{ events: ICalendarEvent[] }>();
const emit = defineEmits(["handleEventId", "getData"]);
const { t, locale } = useI18n();
const { $axios } = useNuxtApp();

const filter = ref({ startDate: "", endDate: "" });
const form = ref<Partial<IAppointmentCreate>>({});
const loading = ref(false);
const calendarRef = ref(0);

const uzWeekdays = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

const calendarOptions = computed(() => ({
  locale: locale.value,
  locales: [enLocale, ruLocale, uzLocale],
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next,title",
    center: "",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  buttonText: {
    month: t("MONTH"),
    week: t("WEEK"),
    day: t("DAY"),
  },
  initialView: "dayGridMonth",
  editable: canEditCalendar.value,
  selectable: canEditCalendar.value,
  selectMirror: true,
  allDaySlot: false,
  dayMaxEvents: 2,
  weekends: true,
  events: props.events,
  eventClick: handleEventClick,
  eventsSet: (ev) => (currentEvents.value = ev),
  eventDrop: canEditCalendar.value ? handleEventDrop : null,
  datesSet: handleDatesSet,
  dayHeaderContent: (arg: any) => {
    const d = arg.date;
    const dayIdx = d.getDay();
    if (locale.value === "uz") return uzWeekdays[dayIdx];
    return d.toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
      weekday: "long",
    });
  },
}));

function handleDatesSet(info: any) {
  const start = info.startStr.replace("+05:00", "");
  const end = info.endStr.replace("+05:00", "");
  if (filter.value.startDate === start && filter.value.endDate === end) return;
  filter.value = { startDate: start, endDate: end };
  emit("getData", filter.value);
}

function handleEventClick(info: any) {
  if (info.event.id) emit("handleEventId", info.event.id);
}

function handleEventDrop(info: any) {
  const app = info.event.extendedProps?.appointment;
  form.value = {
    id: app?.id,
    time: info.event.startStr?.replace("+05:00", ""),
    patientName: app?.patientName,
    patientPhone: app?.patientPhone,
    serviceId: app?.service?.id,
    doctorId: app?.doctor?.id,
  };
  updateAppointment();
}

async function updateAppointment() {
  loading.value = true;
  try {
    await ($axios as AxiosInstance).put(`/api/appointment/update`, form.value);
    emit("getData", filter.value);
  } finally {
    loading.value = false;
  }
}

const updateCalendar = () => calendarRef.value++;
defineExpose({ updateCalendar });

const currentEvents = ref([]);
</script>

<template>
  <div class="calendar-container">
    <FullCalendar
      :key="calendarRef"
      class="demo-app-calendar"
      :options="calendarOptions"
    >
      <template v-slot:eventContent="arg">
        <div
          class="flex flex-col h-full items-start justify-center p-1 rounded-[5px] gap-[2px] w-full event-title"
          :class="
            arg.event.extendedProps.index % 2 === 0
              ? '!bg-[#2B95D6]'
              : '!bg-[#DFF8F9]'
          "
        >
          <p class="flex justify-center text-xs !font-semibold !text-[#4B4D4F]">
            {{ arg.event.title }}
          </p>
          <p
            class="flex justify-center text-[11px] text-gray-20 text-wrap text-start event-dec"
            v-if="arg.event.extendedProps.desc"
          >
            {{ arg.event.extendedProps.desc }}
          </p>
          <p
            class="flex justify-center text-center text-gray-30 text-[11px] items-center gap-1"
            v-if="
              arg.view.type === 'dayGridMonth'
                ? arg.event.extendedProps.time
                : arg.event.extendedProps.date
            "
          >
            <icon-clock />
            {{
              arg.view.type === "dayGridMonth"
                ? arg.event.extendedProps.time
                : arg.event.extendedProps.date
            }}
          </p>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>
<style scoped lang="scss">
.calendar-container {
  /* overflow-x: scroll; */
}

.demo-app-calendar {
}

:deep(.fc-view-harness) {
  overflow-x: scroll;
}

:deep(.fc-view) {
  min-width: 688px;
}

:deep(.event-success .fc-event-main) {
  background-color: #dcf6e8;
  color: #28c76f;
}

:deep(.fc-timeGridWeek-view .event-dec) {
  display: none;
}

:deep(.fc-timeGridWeek-view .event-title),
:deep(.fc-timeGridDay-view .event-title) {
  color: var(--color-blue-dark);
}

:deep(.custom-event) {
  border: none !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  box-shadow: none !important;
  background-color: transparent;
}

:deep(.fc-dayGridMonth-view td) {
  height: 120px !important;
  max-height: 120px !important;
  min-height: 120px !important;
}

:deep(.fc-day .fc-daygrid-day-number) {
  color: var(--color-gray-30);
  font-weight: 600;
  font-size: 12px;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  background-color: var(--color-blue-dark);
  border-radius: 4px;
  color: white;
}

:deep(.fc-daygrid-day-top) {
  padding: 4px;
}

:deep(.fc-day-sun .fc-daygrid-day-number) {
  color: var(--color-red-30);
}

:deep(.fc-day-other) {
  background-image: url(../../assets/img/calendar-empty-bg.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

:deep(.fc-theme-standard td, .fc-theme-standard th) {
  border: 1px solid var(--color-gray-line) !important;
}

:deep(.fc-col-header-cell) {
  background-color: #eaf2f8;
  padding-top: 10px;
  padding-bottom: 10px;
  color: var(--color-gray-20);
  border-left: 1px solid #eaf2f8;
  border-right: 1px solid #eaf2f8;
}

:deep(.fc-prev-button),
:deep(.fc-next-button) {
  background: #eaf2f8;
  color: #5d586c !important;
  border: none !important;
  box-shadow: none !important;
  font-size: 16px !important;
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 12px;
}

:deep(.fc-next-button) {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

:deep(.fc-prev-button) {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover) {
  background: #eaf2f8;
  transition: 0.4s;
}

:deep(.fc-toolbar-chunk > div) {
  display: flex;
}

:deep(.fc-toolbar-title) {
  order: 1;
  margin-right: 16px;
  font-size: 20px;
  align-items: center;
  display: flex;
}

:deep(.fc-prev-button) {
  order: 2;
}

:deep(.fc-next-button) {
  order: 3;
  margin-left: 1px;
}

:deep(.fc-button-group) {
  background-color: #eaf2f8;
  padding: 2px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
}

:deep(.fc-button-group > button) {
  border: none;
  background: #eaf2f8;
  font-family: var(--font-family) !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  text-align: center;
  color: var(--color-gray-30);
  height: 26px;
  border-radius: 8px !important;
  text-transform: capitalize;
}

:deep(.fc-button-group > button:hover) {
  background: var(--color-gray-hover);
  color: var(--color-gray-30);
  border: none;
  outline: none;
}

:deep(.fc-button-active) {
  border: none !important;
  background-color: var(--color-blue-dark) !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.4300000071525574px;
  text-align: center;
  color: white !important;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 0 !important;
  padding: 16px 290px 16px 16px;
  border: 1px solid var(--color-gray-line);
  border-bottom: 0;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

@media (max-width: 1440px) {
  :deep(.fc-view-harness) {
    min-height: 70vh;
  }
}

@media (max-width: 370px) {
  :deep(.fc-header-toolbar) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
