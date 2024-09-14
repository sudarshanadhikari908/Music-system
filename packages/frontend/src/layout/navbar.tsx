// src/components/Topbar.tsx

import React from "react";
import { Layout, Avatar, Menu, Dropdown, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import axiosInstance from "@/shared/axiosInstance";
import { useAppSelector } from "@/store/redux-Hooks";

const { Header } = Layout;
const { Text } = Typography;

const Topbar: React.FC = () => {
  const { user} = useAppSelector((state) => state.user);
  const handleMenuClick = async () => {
    await axiosInstance.post("/auth/logout");
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white shadow-md p-4">
      <div className="flex justify-end items-center space-x-4">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="flex items-center cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <Text className="ml-2">{user?.firstName + user?.lastName}</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
