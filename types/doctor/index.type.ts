export interface IDoctorCreate {
  id?: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  dateOfBirth: string;
  specialization: string;
  departmentId: number;
  roles: string[];
  status: string;
  servicePercents: {
    serviceId: number;
    percent: number;
  }[];
  basicSalary: number;
  gender: string;
  address: string;
}
