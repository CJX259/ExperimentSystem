export interface loadingModelState {
  global: boolean;
  models: any;
}
export interface classData {
  name: string;
  uid: string;
  grade?: string;
}
export interface loading {
  global: boolean;
  models: any;
  effects: any;
}
export interface experiment {
  name: string;
  id: string;
  deadline: string;
  submitted: number;
  stuCount?: number;
  finish?: boolean;
  uid?: string;
}
export interface course {
  name: string;
  uid: string;
}
export type grade = '1' | '2' | '3' | '4';
export interface student {
  name: string;
  id: string;
  com_permit: number;
  count: number;
  grade: grade;
  isShow: number;
  status: number;
  experPath: string;
}
