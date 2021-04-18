export interface loadingModelState {
  global: boolean;
  models: any;
}
export interface classData {
  name: string;
  id: string;
  grade: string;
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
export interface course {
  name: string;
  id: string;
}
export type grade = '优秀' | '良好' | '及格' | '不及格' | '展示报告';
export interface student {
  name: string;
  id: string;
  com_permit: string;
  count: number;
  grade: grade;
  isShow: string;
  status: string;
  experPath: string;
}
