// src/components/Topbar.tsx

import React from "react";
import { Layout, Avatar, Menu, Dropdown, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import axiosInstance from "@/shared/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { useNavigate } from "react-router-dom";
import { clearUser } from "@/store/user/slices";

const { Header } = Layout;
const { Text } = Typography;

const Topbar: React.FC = () => {
  const { userProfile} = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleMenuClick = async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem('isLoggedIn')
    dispatch(clearUser())
    navigate('/auth/login')
  };


  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item>
      <Text className="ml-2">{userProfile?.first_name}{' '}{userProfile?.last_name}</Text>
      </Menu.Item>
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
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
