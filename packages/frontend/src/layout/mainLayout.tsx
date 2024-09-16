import React, { useLayoutEffect } from "react";
import { Layout } from "antd";
import Topbar from "./navbar";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { getProfile } from "@/store/user/actions";

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userProfile } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (!userProfile) {
      dispatch(getProfile("/profile"));
    }
  }, []);

  useLayoutEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <Layout className="min-h-screen overflow-hidden">
      <Sidebar />
      <Layout>
        <Topbar />
        <Content className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100vh-128px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
