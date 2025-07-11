export interface ICalendarResources {
  id: string | number;
  title: string;
  extendedProps?: any
}

export interface ICalendarEvent {
  id: string | number;
  title: string;
  start: string;
  end?: string;
  resourceId?: string | number;
  extendedProps?: {
    desc?: string;
    time?: string;
    type?: boolean
  };
  className?: string;
}
