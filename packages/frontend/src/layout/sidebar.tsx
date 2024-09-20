import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, TikTokOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import RoleCheck from "@/hoc/RoleCheck";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedKey("1");
    } else if (location.pathname === "/artists") {
      setSelectedKey("2");
    }
  }, [location.pathname]);

  return (
    <Sider
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
    >
      <div className="flex items-center justify-center p-4">
        <img
          src="/path-to-logo.png"
          alt="Logo"
          className={`h-10 w-auto bg-white ${collapsed ? "hidden" : ""}`}
        />
      </div>

      <div className="mb-8"></div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="h-full border-none text-white"
      >
        <RoleCheck allowedRoles={["super_admin"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/">User</Link>
          </Menu.Item>
        </RoleCheck>

        <RoleCheck allowedRoles={["super_admin", "artist_manager"]}>
          <Menu.Item key="2" icon={<TikTokOutlined />}>
            <Link to="/artists">Artist</Link>
          </Menu.Item>
        </RoleCheck>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
