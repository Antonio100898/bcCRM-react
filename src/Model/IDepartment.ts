export interface IDepartment {
  id: number;
  canSee: boolean;
  departmentName: string;
}
export interface IDepartmentResponse {
  d: {
    workerDepartments: IDepartment[];

    success: boolean;
    problemId?: number;
    msg: string;
    lastSuppoter: string;
    trackingId: number;
  };
}
