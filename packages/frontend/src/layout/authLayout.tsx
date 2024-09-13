import React,{ReactNode} from 'react';
import { Card } from 'antd';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card
        bordered={false}
        className="max-w-md w-full rounded-2xl shadow-xl"
      >
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
