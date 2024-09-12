
import  { useState } from 'react';
import { Form, Input, DatePicker, Button, notification, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import {ReusableFormProps} from '../types/formTypes'

const GeneralForm = <T,>({
  fields,
  initialValues = {},
  onSubmit,
  submitButtonText,
  formTitle,
}: ReusableFormProps<T>) => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: T) => {
    setLoading(true);
    try {
      await onSubmit(values);
      notification.success({ message: 'Operation Successful' });
    } catch (error: unknown) {
      notification.error({ message: 'An error occurred, please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reusable-form" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Typography.Title level={2}>{formTitle}</Typography.Title>
      <Form
        form={form}
        name="reusable-form"
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
      >
        {fields.map(field => {
          if (field.type === 'date') {
            return (
              <Form.Item
                key={field.name as string}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  defaultValue={initialValues[field.name] ? moment(initialValues[field.name]) : undefined}
                />
              </Form.Item>
            );
          }

          if (field.type === 'password') {
            return (
              <Form.Item
                key={field.name as string}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                <Input.Password
                  type={passwordVisible === field.name ? 'text' : 'password'}
                  iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  onClick={() => setPasswordVisible(prev => (prev === field.name ? null : field.name))}
                />
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={field.name as string}
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              <Input type={field.type} />
            </Form.Item>
          );
        })}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={loading}
          >
            {submitButtonText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralForm;
