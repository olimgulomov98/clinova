export interface IDepartmentCreate {
  name: string;
  description: string;
  parentId: number;
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
