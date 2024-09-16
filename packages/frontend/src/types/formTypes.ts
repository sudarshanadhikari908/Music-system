import { AxiosResponse } from "axios";


export type FieldType = 'text' | 'password' | 'date' | 'email' | 'number' | 'select' |'textarea';

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  options?: {
    value: string;
    label: string;
  }[]; 
  colSpan?: number;
  rules?: any;
  initialValues?: any;
}


export interface ReusableFormProps<T> {
  fields: FieldConfig<T>[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<AxiosResponse | void>;
  submitButtonText: string;
  formTitle: string;
  layout?: string;
  textRight?: boolean;
}
