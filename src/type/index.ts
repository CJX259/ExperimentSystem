export interface loadingModelState {
  global: boolean;
  models: any;
}
export interface classData {
  name: string;
  id: string;
}

export interface experiment {
  name: string;
  id: string;
  deadline: string;
  submitted: number;
  stuCount?: number;
  finish?: boolean;
  uid: string;
}

export interface student {
  name: string;
  id: string;
  com_permit: number;
  count: number;
  grade: '优秀' | '良好' | '及格' | '不及格';
  isShow: string;
  status: string;
  experPath: string;
}
