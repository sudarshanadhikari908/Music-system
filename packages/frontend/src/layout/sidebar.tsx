import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TikTokOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme='light'
       >
      <div className="flex items-center justify-center p-4">
        <img
          src="/path-to-logo.png" 
          alt="Logo"
          className={`h-10 w-auto bg-white ${collapsed ? 'hidden' : ''}`}
        />
      </div>

      <div className="mb-8"></div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        className="h-full border-none text-white"
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/">User</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<TikTokOutlined />}>
          <Link to="/artists">Artist</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
