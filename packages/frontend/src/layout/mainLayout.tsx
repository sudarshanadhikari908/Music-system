// src/components/MainLayout.tsx

import React, { useEffect, useLayoutEffect } from 'react';
import { Layout } from 'antd';
import Topbar from './navbar';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    useLayoutEffect(()=>{
        if(!localStorage.getItem('isLoggedIn')){
            navigate('/auth/login')
        }

    },[])
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Topbar />
        <Content className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </Content>
        <Footer className="text-center bg-gray-100 p-4">
          Music Management Syatem ©2024 Created by Sudarshan
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
