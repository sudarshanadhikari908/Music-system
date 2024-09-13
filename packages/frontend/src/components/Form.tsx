import { useState } from 'react';
import { Form, Input, DatePicker, Button, Typography, Select, Col, Row } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, MailOutlined } from '@ant-design/icons';
import { ReusableFormProps } from '@/types/formTypes';
import showNotification from '@/utils/notification.util';
import axios, {  AxiosResponse } from 'axios';

const GeneralForm = <T,>({
  fields,
  initialValues = {},
  onSubmit,
  submitButtonText,
  formTitle,
  layout = 'vertical',
}: ReusableFormProps<T>) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: T) => {
    setLoading(true);
    try {
      const response = (await onSubmit(values)) as AxiosResponse | undefined;
      if (response) {
        if (response.status === 204) {
          showNotification('success', 'Login Successful');
        } else {
          showNotification('success', response.data?.message || 'Operation Successful');
        }
      } 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        showNotification('error', errorMessage);
      } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reusable-form max-w-2xl mx-auto p-5">
      <Typography.Title level={2} className='text-center text-2xl font-bold'>{formTitle}</Typography.Title>
      <Form
        form={form}
        scrollToFirstError
        name="reusable-form"
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout={layout}
      >
        <Row gutter={16}> 
          {fields.map(field => (
            <Col span={field.colSpan || 24} key={field.name as string}> 
              {field.type === 'date' ? (
                <Form.Item
                  name={field.name as string}
                  label={<span className="font-semibold text-lg">{field.label}</span>} 
                  rules={field.rules}
                >
                  <DatePicker className="h-12 text-base" format="YYYY-MM-DD" />
                </Form.Item>
              ) : field.type === 'email' ? (
                <Form.Item
                  name={field.name as string}
                  label={<span className="font-semibold text-lg">{field.label}</span>}
                  rules={field.rules}
                >
                  <Input suffix={<MailOutlined />} type="email" className="h-12 text-base" />
                </Form.Item>
              ) : field.type === 'password' ? (
                <Form.Item
                  name={field.name as string}
                  label={<span className="font-semibold text-lg">{field.label}</span>}
                  rules={field.rules}
                >
                  <Input.Password
                    iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    className="h-12 text-base" 
                  />
                </Form.Item>
              ) : field.type === 'select' ? (
                <Form.Item
                  name={field.name as string}
                  label={<span className="font-semibold text-lg">{field.label}</span>}
                  rules={field.rules}
                >
                  <Select className="h-12 text-base">
                    {field.options?.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  name={field.name as string}
                  label={<span className="font-semibold text-lg">{field.label}</span>}
                  rules={field.rules}
                >
                  <Input type={field.type} className="h-12 text-base" />
                </Form.Item>
              )}
            </Col>
          ))}
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={loading}
            className="py-4 text-lg"
          >
            {submitButtonText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
 
export default GeneralForm;
