export interface IDoctorCreate {
  id?: number
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
}
