// src/components/Sidebar.tsx

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TikTokOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider width={256} className="bg-gray-800 text-white">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        className="h-full border-none"
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/user">User</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<TikTokOutlined />}>
          <Link to="/artist">Artist</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
