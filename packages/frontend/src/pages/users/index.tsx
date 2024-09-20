import React, { useEffect } from "react";
import MainLayout from "@/layout/mainLayout";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { PlusCircleOutlined } from '@ant-design/icons';

import { getAllUser } from "@/store/user/actions";
import { UserProfile } from "@/types/userTypes";
import CustomTable from "@/components/Table";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/shared/axiosInstance";
import axios from "axios";
import showNotification from "@/utils/notification.util";
import { PaginationType } from "@/types/paginationType";

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users, usersLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUser("/users"));
  }, [dispatch]);

  const handleCreate = ()=>{
    navigate('/user/create')
  }

  const onRowClick = (id: number)=>{
    navigate(`/user/${id}`)
  }

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (text: any, record: UserProfile) => (
        <span>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Date of Birth",
      key: "dob",
      render: (text: any, record: UserProfile) => {
        if (!record.dob) {
          return "N/A";
        }
        const dob = new Date(record.dob);
        return dob.toLocaleDateString();
      },
    },
    {
      title: "Address",
      key: "address",
      render: (text: any, record: UserProfile) => record.address ?? "N/A",
    },
  ];

  const handleEdit = (record: UserProfile) => {
    navigate(`/user/update/${record?.id}`)
  };

  const handleDelete = async(record: UserProfile) => {
    try{
      const response =await axiosInstance.delete(`/user/${record?.id}`);
      if(response?.status === 200){
        showNotification('success',response?.data?.message)
        dispatch(getAllUser("/users"));
      }
    }catch(e){
      if (axios.isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'An unexpected error occurred.';
        showNotification('error', errorMessage);
      } 
    }
  };

  const pageChange = ({pageSize, currentPage}:PaginationType)=>{
    dispatch(getAllUser(`/users/?page=${currentPage}&pageSize=${pageSize}`))
  }

  return (
    <MainLayout>
    <div className="p-4">
      <h1 className="text-xl mb-4">User List</h1>
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          onClick={handleCreate}
        >
          <PlusCircleOutlined className="mr-2" />
          Create
        </Button>
      </div>
      <CustomTable
        data={users?.data || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={onRowClick}
        allowedRoles={['super_admin']}
        loading={usersLoading}
        pageChange={pageChange}
        total={users?.total}
      />
    </div>
  </MainLayout>
  );
};

export default UserPage;
