// src/pages/LoginPage.tsx

import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import axiosInstance from '../axiosInstance'; // Adjust the import path as needed

// Define the type for login form data
type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const onFinish = async (values: LoginFormData) => {
   
  };

  return (
    <div className="login-page" style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      
    </div>
  );
};

export default LoginPage;
