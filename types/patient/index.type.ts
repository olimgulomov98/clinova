export interface IPatientCreate {
  id?: number;
  name: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  gender: string,
  occupation: string,
  source: string
}

export interface IDepartmentListItem {
  code: string;
  createdBy: string;
  creationDate: string;
  description: string;
  doctorCount: number;
  id: number;
  modifiedBy: string | null;
  modifiedDate: string;
  name: string;
  serviceCount: number;
}
