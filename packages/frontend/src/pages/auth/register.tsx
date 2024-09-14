import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import GeneralForm from '@/components/Form';
import { FieldConfig } from '@/types/formTypes';
import AuthLayout from '@/layout/authLayout';
import axiosInstance from '@/shared/axiosInstance';
import moment from 'moment';

const RegisterForm = () => {
  const navigate = useNavigate();

  const registrationFields: FieldConfig<{
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    mobile_number?: string;
    dob?: string;
    gender?: string;
    address?: string;
    role: string;
  }>[] = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      rules: [
        { required: true, message: 'First name is required' },
        { pattern: /^[A-Za-z]+$/, message: 'First name should contain only alphabetic characters' },
      ],
      colSpan: 12, // Adjust column span to control field width
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      rules: [
        { required: true, message: 'Last name is required' },
        { pattern: /^[A-Za-z]+$/, message: 'Last name should contain only alphabetic characters' },
      ],
      colSpan: 12,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      rules: [
        { required: true, message: 'Username is required' },
        { min: 3, message: 'Username must be at least 3 characters long' },
      ],
      colSpan: 12,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      rules: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' },
      ],
      colSpan: 12,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      rules: [
        { required: true, message: 'Password is required' },
        { min: 6, message: 'Password must be at least 6 characters long' },
      ],
      colSpan: 12,
    },
    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'text',
      rules: [
        { pattern: /^[9][0-9]{9}$/, message: 'Phone number must be a valid 10-digit Nepali number starting with 9' },
        { required: false },
      ],
      colSpan: 12,
    },
 
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
        { value: 'O', label: 'Other' },
      ],
      colSpan: 12,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'artist_manager', label: 'Artist Manager' },
        { value: 'artist', label: 'Artist' },
      ],
      rules: [
        { required: true, message: 'Role is required' },
      ],
      colSpan: 12,
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      rules: [
        { type: 'date', message: 'Date of birth must be a valid date' },
        { required: false },
      ],
      colSpan: 12,
    },
  ];

  const handleRegister = async (values: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    mobile_number?: string;
    dob?: string;
    gender?: string;
    address?: string;
    role: string;
  }) => {
    const formattedValues = {
      ...values,
      dob: values.dob ? moment(values.dob).format('YYYY-MM-DD') : undefined,
    };
  
      const response = await axiosInstance.post('/auth/register', formattedValues);
      if (response.status === 201) {
        navigate('/auth/login');
        return response;
      }
  };

  return (
    <AuthLayout width='xl'>
      <GeneralForm
        fields={registrationFields}
        formTitle="Register"
        onSubmit={handleRegister}
        submitButtonText="Register"
        layout='vertical'
      />
      <div className="text-center mt-4">
        <p className="text-gray-600">Already have an account?</p>
        <Button
          type="link"
          onClick={() => navigate('/auth/login')}
          style={{ padding: 0, fontSize: '16px' }}
        >
          Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
