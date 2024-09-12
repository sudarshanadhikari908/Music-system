
import { FormItemProps } from 'antd/lib/form/FormItem';

export type FieldType = 'text' | 'password' | 'date' | 'email';

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  rules?: FormItemProps['rules'];
}

export interface ReusableFormProps<T> {
  fields: FieldConfig<T>[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  submitButtonText: string;
  formTitle: string;
}
