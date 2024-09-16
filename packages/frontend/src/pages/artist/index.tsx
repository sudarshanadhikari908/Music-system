import CustomTable from "@/components/Table";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllArtist } from "@/store/artist/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { Artist } from "@/types/artistTypes";
import { PaginationType } from "@/types/paginationType";
import showNotification from "@/utils/notification.util";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Artists: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artists, artistsLoading } = useAppSelector((state) => state.artist);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Artist) => record.name || "N/A",
    },
    {
      title: "Date of Birth",
      key: "dob",
      render: (text: string, record: Artist) => {
        if (!record.dob) {
          return "N/A";
        }
        const dob = new Date(record.dob);
        return dob.toLocaleDateString();
      },
    },
    {
      title: "Gender",
      key: "gender",
      render: (text: string, record: Artist) => {
        switch (record.gender) {
          case "M":
            return "Male";
          case "F":
            return "Female";
          case "O":
            return "Other";
          default:
            return "N/A";
        }
      },
    },
    {
      title: "Address",
      key: "address",
      render: (text: string, record: Artist) => record.address || "N/A",
    },
    {
      title: "Number of Albums Released",
      dataIndex: "no_of_albums_released",
      key: "no_of_albums_released",
      render: (text: string, record: Artist) =>
        record.no_of_albums_released ?? "N/A",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      render: (text: string, record: Artist) => record.bio || "N/A",
    },
    {
      title: "First Release Year",
      dataIndex: "first_release_year",
      key: "first_release_year",
      render: (text: string, record: Artist) =>
        record.first_release_year || "N/A",
    },
  ];

  const handleCreate = () => {
    navigate("/artist/create");
  };

  const handleEdit = (record: Artist) => {
    navigate(`/user/update/${record?.id}`);
  };

  const handleDelete = async (record: Artist) => {
    try {
      const response = await axiosInstance.delete(`/artist/${record?.id}`);
      if (response?.status === 200) {
        showNotification("success", response?.data?.message);
        dispatch(getAllArtist("/artists"));
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred.";
        showNotification("error", errorMessage);
      }
    }
  };

  const onRowClick = (id: number)=>{
    navigate(`/artist/${id}`)
  }

  const pageChange = ({pageSize, currentPage}:PaginationType)=>{
    dispatch(getAllArtist(`/artists/?page=${currentPage}&pageSize=${pageSize}`))
  }

  useEffect(() => {
    dispatch(getAllArtist("/artists"));
  }, []);
  
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-xl mb-4">Artist List</h1>
        <div className="mb-4 flex justify-end">
          <Button type="primary" onClick={handleCreate}>
            <PlusCircleOutlined className="mr-2" />
            Create
          </Button>
        </div>
        <CustomTable
          data={artists?.data || []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={artistsLoading}
          pageChange={pageChange}
          total={artists?.total}
          onRowClick={onRowClick}
        />
      </div>
    </MainLayout>
  );
};

export default Artists;
