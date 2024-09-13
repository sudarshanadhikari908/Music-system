import { AxiosResponse } from "axios";


export type FieldType = 'text' | 'password' | 'date' | 'email';

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  rules: {
    required?: boolean;
    message: string;
    type?: string;
  }[];
}

export interface ReusableFormProps<T> {
  fields: FieldConfig<T>[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<AxiosResponse | void>;
  submitButtonText: string;
  formTitle: string;
  layout: string | undefined;
}
