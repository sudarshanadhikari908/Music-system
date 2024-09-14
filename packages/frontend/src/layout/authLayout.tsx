import React, { ReactNode, useEffect } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  width: 'sm' | 'md' | 'lg' | 'xl'; 
}

const widthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',

};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, width }) => {
  const navigate = useNavigate()
  useEffect(()=>{
    if(localStorage.getItem('isLoggedIn')){
        navigate('/')
    }

  },[])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card
        bordered={false}
        className={`${widthMap[width]} w-full rounded-2xl shadow-xl`}
      >
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
