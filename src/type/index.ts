export interface loadingModelState {
  global: boolean,
  models: any,
}
export interface classData {
  name: string,
  id: string
}

export interface experiment {
  name: string
  id: string
  deadline: string
  submitted: number
  stuCount?: number
  finish?: boolean
  uid: string
}