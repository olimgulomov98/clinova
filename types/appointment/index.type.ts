export interface IAppointmentCreate {
  id?: number;
  time: string;
  patientName?: string,
  patientPhone?: string,
  serviceId?: number;
  doctorId?: number;
}

export interface IAppointmentListItem {
  role: string;
  departmentId: number;
  serviceId: number;
  doctorId: number;
  searchKey: string;
  orderBy: string;
  desc: boolean;
}
