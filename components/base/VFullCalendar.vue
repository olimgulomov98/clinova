<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {ICalendarEvent} from "@/types/time-grid-calendar.type";
import type {AxiosInstance} from "axios";
import type {IAppointmentCreate} from "~/types/appointment/index.type";
import enLocale from "@fullcalendar/core/locales/en-gb"; // yoki 'en'
import ruLocale from "@fullcalendar/core/locales/ru";
import uzLocale from "../../locales/fullcalendar-uz";

const loading = ref(false);
const props = defineProps<{ events: ICalendarEvent[] }>();
const {t, locale} = useI18n();
const {$axios} = useNuxtApp();
const emit = defineEmits(["handleEventId", "getData"]);
const currentEvents = ref([]);
const filter = ref({
  startDate: "",
  endDate: "",
});
const form = ref<Partial<IAppointmentCreate>>({
  time: "",
  patientName: undefined,
  patientPhone: undefined,
  serviceId: undefined,
  doctorId: undefined,
});
const uzWeekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const calendarOptions = computed<any>(() => {
  return {
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
      addEventBtn: t("ADD_EVENT"),
    },
    titleFormat: {
      month: "long",
      // day: "numeric",
      year: "numeric",
    },
    initialView: "dayGridMonth",
    dayHeaderContent: (arg: any) => {
      if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
        if (locale.value === 'uz') {
          const dayIndex = arg.date.getDay();
          const day = arg.date.getDate();
          return day + ' ' + uzWeekdays[dayIndex];
        }
        return arg.date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
          weekday: "long",
          day: "numeric",
        });
      }
      if (locale.value === 'uz') {
        const dayIndex = arg.date.getDay();
        return uzWeekdays[dayIndex];
      }
      return arg.date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: "long",
      });
    },
    events: props.events,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    weekends: true,
    allDaySlot: false,
    eventClick: handleEventClick,
    eventsSet: handleEvents,
    eventDrop: handleEventDrop,
    datesSet: handleDatesSet,
  };
});

function handleDatesSet(info: any) {
  const newStart = info.startStr.replace("+05:00", "");
  const newEnd = info.endStr.replace("+05:00", "");
  if (filter.value.startDate === newStart && filter.value.endDate === newEnd) return;

  filter.value.startDate = newStart;
  filter.value.endDate = newEnd;
  emit("getData", filter.value);
}

function handleEventDrop(info: any) {
  form.value = {
    id: info.event.extendedProps?.appointment?.id,
    time: info.event.startStr?.replace("+05:00", ""),
    patientName: info.event.extendedProps?.appointment?.patientName,
    patientPhone: info.event.extendedProps?.appointment?.patientPhone,
    serviceId: info.event.extendedProps?.appointment?.service?.id,
    doctorId: info.event.extendedProps?.appointment?.doctor?.id,
  };
  createAppointment();
}

async function createAppointment() {
  loading.value = true;
  const method = "put";
  (<AxiosInstance>$axios)
      [method](`/api/appointment/update`, form.value)
      .then((res) => {
        notificationShower("success", t("APPOINTMENT_UPDATE_SUCCESS"));
        emit("getData", filter.value);
      })
      .finally(() => {
        loading.value = false;
      });
}

function handleEventClick(clickInfo: any) {
  if (clickInfo.event.id) {
    emit("handleEventId", clickInfo.event.id);
  }
}

function handleEvents(events: any) {
  currentEvents.value = events;
}

const calendarRef = ref(0);
const updateCalendar = () => {
  calendarRef.value++;
};
defineExpose({
  updateCalendar,
});
</script>

<template>
  <div class="calendar-container">
    <FullCalendar :key="calendarRef" class="demo-app-calendar" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div
            class="flex flex-col h-full items-start justify-center p-1 rounded-[5px] gap-[2px] w-full event-title"
            :class="arg.event.extendedProps.index % 2 === 0 ? '!bg-[#2B95D6]' : '!bg-[#DFF8F9]'"
        >
          <p class="flex justify-center text-xs !font-semibold !text-[#4B4D4F]">{{ arg.event.title }}</p>
          <p
              class="flex justify-center text-[11px] text-gray-20 text-wrap text-start event-dec"
              v-if="arg.event.extendedProps.desc"
          >
            {{ arg.event.extendedProps.desc }}
          </p>
          <p
              class="flex justify-center text-center text-gray-30 text-[11px] items-center gap-1"
              v-if="arg.view.type === 'dayGridMonth' ? arg.event.extendedProps.time : arg.event.extendedProps.date"
          >
            <icon-clock/>
            {{ arg.view.type === "dayGridMonth" ? arg.event.extendedProps.time : arg.event.extendedProps.date }}
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
